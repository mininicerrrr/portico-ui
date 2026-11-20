#!/usr/bin/env node
/**
 * QA release candidate evidence — fresh writes only, consistency-checked.
 * Run only at final release-candidate HEAD after all script commits land.
 */
import { createHash } from 'node:crypto'
import { execSync, spawnSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const outDir =
  process.env.RELEASE_CANDIDATE_OUT || '/opt/cursor/artifacts/release-candidate-0.1.3'
const artifactsRoot = '/opt/cursor/artifacts'

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: repoRoot, encoding: 'utf8', ...opts }).trim()
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function sha512Base64(path) {
  return createHash('sha512').update(readFileSync(path)).digest('base64')
}

function runCapture(label, cmd, log, { allowNonZero = false } = {}) {
  const r = spawnSync(cmd, { cwd: repoRoot, shell: true, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  const entry = {
    label,
    command: cmd,
    exitCode: r.status,
    stdoutTail: (r.stdout || '').slice(-1200),
    stderrTail: (r.stderr || '').slice(-1200)
  }
  log.steps.push(entry)
  if (!allowNonZero && r.status !== 0) throw new Error(`step failed: ${label} exit ${r.status}`)
  return r
}

function recordBuildDiagnostics(label, r, log) {
  const combined = `${r.stdout || ''}\n${r.stderr || ''}`
  const ts2339 = (combined.match(/TS2339/g) || []).length
  log.buildDiagnostics = log.buildDiagnostics || []
  log.buildDiagnostics.push({
    label,
    exitCode: r.status,
    rollupAndBundleSucceeded: r.status === 0,
    vitePluginDtsStderrTypeDiagnostics: {
      approximateTS2339Count: ts2339,
      present: ts2339 > 0
    },
    explanation:
      'During `npm run build`, vite-plugin-dts invokes vue-tsc on .vue sources and logs template-scope TS2339 lines to stderr (e.g. Option.vue prop inference). Rollup library output and patch-published-dts still complete with exit 0. Pre-existing on main+0.1.3; not a gate failure unless exitCode !== 0.'
  })
}

function quarantineStaleRootEvidence(log) {
  const holdDir = join(artifactsRoot, '_HOLD-superseded-0.1.2-b4c202d')
  mkdirSync(holdDir, { recursive: true })
  for (const name of ['portico-ui-consumer-matrix-evidence.json', 'portico-ui-consumer-compat-evidence.json']) {
    const src = join(artifactsRoot, name)
    if (!existsSync(src)) continue
    const raw = readFileSync(src, 'utf8')
    if (/"packedVersion": "0.1.2"/.test(raw) || /b4c202d/.test(raw)) {
      const dest = join(holdDir, `${Date.now()}-${name}`)
      renameSync(src, dest)
      log.quarantined.push({ from: src, to: dest })
    }
  }
  rmSync(join(repoRoot, '.consumer-pack-test', 'portico-ui-consumer-matrix-evidence.json'), { force: true })
}

function cleanBuildPack(label, log) {
  runCapture(`${label}: rm+ci`, 'rm -rf node_modules dist portico-ui-*.tgz && npm ci', log)
  const buildR = runCapture(`${label}: build`, 'npm run build', log)
  recordBuildDiagnostics(`${label}:build`, buildR, log)
  runCapture(`${label}: test`, 'npm test', log)
  const packR = runCapture(`${label}: pack`, 'npm pack --silent', log)
  const tgzName = (packR.stdout || '').trim().split('\n').pop()
  const tgzPath = resolve(repoRoot, tgzName)
  return {
    label,
    tgzName,
    tgzPath,
    sha256: sha256File(tgzPath),
    sha512Base64: sha512Base64(tgzPath),
    integritySRI: `sha512-${sha512Base64(tgzPath)}`,
    distStyleSha256: sha256File(resolve(repoRoot, 'dist/style.css')),
    distEsSha256: sha256File(resolve(repoRoot, 'dist/portico-ui.es.js'))
  }
}

function assertConsistency(report) {
  const c = report.consistencyChecks
  const errors = []
  const eq = [
    ['pack vs consumer tarball', c.packSha256, c.consumerTarballSha256],
    ['pack vs pack-dialog-runtime tarball', c.packSha256, c.packDialogRuntimeTarballSha256],
    ['pack vs pack-dialog-playwright tarball', c.packSha256, c.packDialogPlaywrightTarballSha256],
    ['gitHead vs consumer', c.gitHead, c.consumerGitHead],
    ['gitHead vs pack-dialog-runtime', c.gitHead, c.packDialogRuntimeGitHead],
    ['gitHead vs pack-dialog-playwright', c.gitHead, c.packDialogPlaywrightGitHead],
    ['version vs consumer', c.packedVersion, c.consumerPackedVersion]
  ]
  for (const [name, a, b] of eq) {
    if (a !== b) errors.push(name)
  }
  if (!c.consumerEvidenceHasTopLevelOk) errors.push('consumer evidence ok')
  if (c.consumerFailures !== 0) errors.push('consumer failures')
  if (!report.packInstalledDialogRuntime?.ok) errors.push('pack dialog runtime (jsdom)')
  if (!report.packInstalledDialogPlaywrightBrowser?.ok) errors.push('pack dialog playwright')
  if (!report.sourceTreeDocsDialogSmoke?.evidence?.ok) errors.push('docs dialog smoke')
  if (errors.length) throw new Error(`consistency check failed: ${errors.join('; ')}`)
  report.consistencyChecks.passed = true
}

function writePmInstructions(outDir, report) {
  const { packReproducibility: pack, package: pkg, git } = report
  const md = `# portico-ui @${pkg.version} — PM 发布指引（Agent 未执行）

## 审定字节（本采集 head \`${git.releaseCandidateHead}\`）

| 资产 | 值 |
|------|-----|
| Tarball | \`${pack.canonicalTarball}\` |
| SHA256 | \`${pack.sha256}\` |
| SRI | \`${pack.integritySRI}\` |
| 路径 | \`${pack.canonicalPath}\` |

**任何重建发布前**必须用上述 SHA256 与本地 \`npm pack\` 产物逐字节比对；不一致则需重新审定与 QA。

## Registry（只读）

已发布最新：**0.1.2**；候选 **0.1.3** 尚未占用。

## 发布步骤（Maintainer 机器，需 npm 认证；Agent 不读取凭据）

\`\`\`bash
git checkout ${git.releaseCandidateHead}
rm -rf node_modules dist
npm ci
npm run build   # 见 release-candidate-report buildDiagnostics：stderr 可有 dts TS2339，exit 0 才为通过
npm test
npm pack
shasum -a 256 portico-ui-${pkg.version}.tgz   # 必须等于 ${pack.sha256}
node scripts/verify-npm-consumers.mjs
node scripts/verify-pack-dialog-playwright.mjs  # PACK_TARBALL=./portico-ui-${pkg.version}.tgz ...
\`\`\`

\`\`\`bash
npm whoami   # 需 portico-ui publish 权限 + OTP/Token（人类配置）
npm publish --access public
git tag v${pkg.version} && git push origin v${pkg.version}   # 可选
\`\`\`

## 勿用本地 tarball 装生产 Admin

等待 registry 正式 \`portico-ui@${pkg.version}\`。

## gh-pages

本任务不 dispatch；站点 URL 保持 README：\`https://mininicerrrr.github.io/portico-ui/\`
`
  writeFileSync(join(outDir, 'PM-publish-instructions.md'), md)
}

function main() {
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  const log = { startedAt: new Date().toISOString(), steps: [], quarantined: [], buildDiagnostics: [] }
  quarantineStaleRootEvidence(log)

  const head = sh('git rev-parse HEAD')
  const fixOnMain = sh('git rev-parse origin/main')
  const packedVersion = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8')).version
  const treeAtCapture = sh(`git diff --stat ${head}`) // should be empty if clean; still record head blob ids

  const pack1 = cleanBuildPack('clean-run-1', log)
  copyFileSync(pack1.tgzPath, join(outDir, pack1.tgzName))
  const pack2 = cleanBuildPack('clean-run-2', log)
  copyFileSync(pack2.tgzPath, join(outDir, `repro-${pack2.tgzName}`))
  if (pack1.sha256 !== pack2.sha256) throw new Error('pack reproducibility failed')

  const canonicalTgz = join(outDir, pack1.tgzName)
  const consumerOut = join(outDir, 'portico-ui-consumer-matrix-evidence.json')
  runCapture(
    'consumer-matrix',
    `EXPECT_GIT_HEAD=${head} EXPECT_PACKED_VERSION=${packedVersion} EXPECT_TARBALL_SHA256=${pack1.sha256} CONSUMER_MATRIX_OUT=${consumerOut} node scripts/verify-npm-consumers.mjs`,
    log
  )
  const consumer = JSON.parse(readFileSync(consumerOut, 'utf8'))

  const packDialogRuntimeOut = join(outDir, 'pack-dialog-runtime-evidence.json')
  runCapture(
    'pack-dialog-runtime',
    `PACK_TARBALL=${canonicalTgz} EXPECT_TARBALL_SHA256=${pack1.sha256} EXPECT_GIT_HEAD=${head} PACK_DIALOG_EVIDENCE_OUT=${packDialogRuntimeOut} node scripts/verify-pack-dialog-runtime.mjs`,
    log
  )
  const packDialogRuntime = JSON.parse(readFileSync(packDialogRuntimeOut, 'utf8'))

  const packDialogPlaywrightOut = join(outDir, 'pack-dialog-playwright-evidence.json')
  runCapture(
    'pack-dialog-playwright',
    `PACK_TARBALL=${canonicalTgz} EXPECT_TARBALL_SHA256=${pack1.sha256} EXPECT_GIT_HEAD=${head} PACK_DIST_STYLE_SHA256=${pack1.distStyleSha256} PACK_DIALOG_PLAYWRIGHT_OUT=${packDialogPlaywrightOut} node scripts/verify-pack-dialog-playwright.mjs`,
    log
  )
  const packDialogPlaywright = JSON.parse(readFileSync(packDialogPlaywrightOut, 'utf8'))

  runCapture('docs:build', 'npm run docs:build', log)
  const smokeR = runCapture('docs-preview-smoke', 'node scripts/docs-preview-smoke.mjs', log)
  const smoke = JSON.parse((smokeR.stdout || '').slice((smokeR.stdout || '').indexOf('{')))

  const dialogVueBlob = sh(`git rev-parse ${head}:src/components/dialog/Dialog.vue`)
  const versionOnlyDiff = sh(`git diff --stat ${fixOnMain}..${head}`)

  const report = {
    defectId: 'UI-DIALOG-ESC-001',
    capturePolicy: 'Single full capture at final script HEAD; do not re-run after further script commits without recapture.',
    package: { name: 'portico-ui', version: packedVersion },
    git: {
      releaseCandidateHead: head,
      mainSquashMerge: fixOnMain,
      dialogVueBlobAtCaptureHead: dialogVueBlob,
      workingTreeDiffAtCapture: treeAtCapture || '(clean)',
      versionOnlyDiffStatSinceMainFix: versionOnlyDiff
    },
    packReproducibility: {
      reproducible: true,
      runs: [pack1, pack2],
      canonicalTarball: pack1.tgzName,
      canonicalPath: canonicalTgz,
      sha256: pack1.sha256,
      integritySRI: pack1.integritySRI
    },
    buildDiagnostics: log.buildDiagnostics,
    sourceTreeDocsDialogSmoke: {
      mode: 'vitepress-build-static-server-playwright-chromium',
      notPackInstalled: true,
      evidence: smoke.dialogSmoke
    },
    packInstalledDialogRuntime: { ...packDialogRuntime, notPlaywrightBrowser: true },
    packInstalledDialogPlaywrightBrowser: packDialogPlaywright,
    consumerMatrixEvidenceFile: consumerOut,
    consumerMatrixSummary: {
      ok: consumer.ok,
      failures: consumer.failures,
      matrixItemCount: consumer.matrix?.length,
      capturedAt: consumer.capturedAt,
      gitHead: consumer.gitHead,
      packedVersion: consumer.packedVersion,
      tarballSha256: consumer.tarballSha256
    },
    consistencyChecks: {
      passed: false,
      gitHead: head,
      packedVersion,
      packSha256: pack1.sha256,
      consumerTarballSha256: consumer.tarballSha256,
      consumerGitHead: consumer.gitHead,
      consumerPackedVersion: consumer.packedVersion,
      consumerFailures: consumer.failures,
      consumerEvidenceHasTopLevelOk: consumer.ok === true,
      packDialogRuntimeTarballSha256: packDialogRuntime.tarballSha256,
      packDialogRuntimeGitHead: packDialogRuntime.gitHead,
      packDialogPlaywrightTarballSha256: packDialogPlaywright.tarballSha256,
      packDialogPlaywrightGitHead: packDialogPlaywright.gitHead,
      packDistStyleSha256Aligned: packDialogPlaywright.packDist?.styleCssSha256 === pack1.distStyleSha256
    },
    commandLog: log,
    publishNotExecuted: true
  }

  assertConsistency(report)
  writePmInstructions(outDir, report)
  writeFileSync(join(outDir, 'release-candidate-report.json'), JSON.stringify(report, null, 2))
  writeFileSync(join(outDir, 'capture.log'), JSON.stringify(log, null, 2))
  console.log(JSON.stringify({ ok: true, head, tarballSha256: pack1.sha256 }, null, 2))
}

main()