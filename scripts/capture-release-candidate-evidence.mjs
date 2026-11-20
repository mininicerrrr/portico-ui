#!/usr/bin/env node
/**
 * QA release candidate evidence: two clean ci/build/pack cycles, consumer matrix, dialog smoke.
 * Writes to RELEASE_CANDIDATE_OUT (default /opt/cursor/artifacts/release-candidate-0.1.3).
 */
import { createHash } from 'node:crypto'
import { execSync, spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const outDir =
  process.env.RELEASE_CANDIDATE_OUT || '/opt/cursor/artifacts/release-candidate-0.1.3'

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: repoRoot, encoding: 'utf8', ...opts }).trim()
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function sha512Base64(path) {
  const buf = readFileSync(path)
  return createHash('sha512').update(buf).digest('base64')
}

function cleanBuildPack(label) {
  sh('rm -rf node_modules dist portico-ui-*.tgz')
  sh('npm ci')
  sh('npm run build')
  sh('npm test')
  const packOut = sh('npm pack --silent')
  const tgzName = packOut.split('\n').pop() || packOut
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

function main() {
  mkdirSync(outDir, { recursive: true })
  const head = sh('git rev-parse HEAD')
  const fixOnMain = sh('git rev-parse origin/main')
  const versionOnlyDiff = sh(`git diff --stat ${fixOnMain}..${head}`)
  const dialogVueAtHead = sh(`git rev-parse ${head}:src/components/dialog/Dialog.vue`)
  const dialogVueAtFix = sh(`git rev-parse ${fixOnMain}:src/components/dialog/Dialog.vue`)

  const pack1 = cleanBuildPack('clean-run-1')
  copyFileSync(pack1.tgzPath, join(outDir, pack1.tgzName))
  const pack2 = cleanBuildPack('clean-run-2')
  copyFileSync(pack2.tgzPath, join(outDir, `repro-${pack2.tgzName}`))

  sh('npm run docs:build')
  const smokeRaw = sh('node scripts/docs-preview-smoke.mjs')
  const smoke = JSON.parse(smokeRaw.slice(smokeRaw.indexOf('{')))

  process.env.CONSUMER_MATRIX_OUT = join(outDir, 'portico-ui-consumer-matrix-evidence.json')
  shInherit('node scripts/verify-npm-consumers.mjs')

  const consumer = JSON.parse(readFileSync(process.env.CONSUMER_MATRIX_OUT, 'utf8'))

  const reproducible = pack1.sha256 === pack2.sha256

  const report = {
    defectId: 'UI-DIALOG-ESC-001',
    package: { name: 'portico-ui', version: JSON.parse(readFileSync(resolve(repoRoot, 'package.json'))).version },
    git: {
      releaseCandidateHead: head,
      mainSquashMerge: fixOnMain,
      pr5: { number: 5, state: 'merged', squashOnMain: fixOnMain },
      versionOnlyDiffStatSinceMainFix: versionOnlyDiff,
      dialogVueBlobOnMainFix: dialogVueAtFix,
      dialogVueBlobAtHead: dialogVueAtHead,
      dialogImplementationUnchangedInVersionCommit: dialogVueAtHead === dialogVueAtFix
    },
    registryVersionsVerified: ['0.0.0-stage', '0.1.0', '0.1.1', '0.1.2'],
    nextPatchSelected: '0.1.3',
    packReproducibility: {
      reproducible,
      runs: [pack1, pack2],
      canonicalTarball: pack1.tgzName,
      canonicalPath: join(outDir, pack1.tgzName)
    },
    docsDialogSmoke: smoke.dialogSmoke,
    consumerMatrix: { ok: consumer.ok, failures: consumer.failures, gitHead: consumer.gitHead, tarballSha: consumer.tarballSha },
    distMetadataNote:
      'Version-only commit changes package.json version fields in tarball, not Dialog runtime logic (same as main squash fix).',
    publishNotExecuted: true
  }

  writeFileSync(join(outDir, 'release-candidate-report.json'), JSON.stringify(report, null, 2))
  writeFileSync(
    join(outDir, 'PM-publish-instructions.md'),
    `# portico-ui @${report.package.version} — PM 发布指引（Agent 未执行）

## 前置
- **PR #5 已 squash 合并**：\`main\` = \`${fixOnMain}\`
- 合并本发布候选分支（版本 \`0.1.3\` only）或 squash 顺序：fix → version
- 确认 [\`origin/main\`](https://github.com/mininicerrrr/portico-ui) CI 绿

## Registry 现状（只读核实）
- 已发布：\`0.0.0-stage\`, \`0.1.0\`, \`0.1.1\`, \`0.1.2\`（latest）
- 候选版本：**\`0.1.3\`**（registry 上未占用）

## 候选包
- Tarball：\`${pack1.tgzName}\`
- SHA256：\`${pack1.sha256}\`
- SRI：\`${pack1.integritySRI}\`

## 本地复现（与 CI 同级）
\`\`\`bash
git checkout <merge-commit-on-main>
rm -rf node_modules dist
npm ci
npm run build
npm test
npm pack
node scripts/verify-npm-consumers.mjs
node scripts/docs-preview-smoke.mjs
\`\`\`

## npm publish（需 Maintainer 认证，勿在 Agent 环境执行）
1. \`npm whoami\` — 需已登录拥有 \`portico-ui\` publish 权限的 npm 账号（**OTP/Token 由人类配置，Agent 不读取**）
2. 在 **干净 tree** 上：\`npm ci && npm run build && npm test\`
3. \`npm publish --access public\`（本包为 public scoped 与否以 package.json 为准；当前为 \`portico-ui\` 非 scoped）
4. 可选：\`git tag v0.1.3 && git push origin v0.1.3\`

## gh-pages / 文档（本任务不 dispatch）
- 站点地址保持 README：\`https://mininicerrrr.github.io/portico-ui/\`
- 文档部署需单独 workflow / Pages 权限；**不在此发布候选中执行**

## Admin
- 请等待 **npm registry 正式 \`0.1.3\`** 后再安装；**勿**从本地 tarball 装生产。
`
  )

  console.log(JSON.stringify(report, null, 2))
  if (!reproducible || !consumer.ok || !smoke.dialogSmoke?.ok) process.exit(1)
}

function shInherit(cmd) {
  const r = spawnSync(cmd, { cwd: repoRoot, stdio: 'inherit', shell: true })
  if (r.status !== 0) throw new Error(`failed: ${cmd}`)
}

main()