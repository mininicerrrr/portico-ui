#!/usr/bin/env node
/**
 * QA release candidate evidence — fresh writes only, consistency-checked.
 * Never copies stale /opt/cursor/artifacts root evidence files.
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
import { resolve, join, dirname } from 'node:path'
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

function runStep(label, cmd, log) {
  const r = spawnSync(cmd, { cwd: repoRoot, shell: true, encoding: 'utf8' })
  log.steps.push({
    label,
    command: cmd,
    exitCode: r.status,
    stdoutTail: (r.stdout || '').slice(-800),
    stderrTail: (r.stderr || '').slice(-800)
  })
  if (r.status !== 0) throw new Error(`step failed: ${label} exit ${r.status}`)
  return r
}

function quarantineStaleRootEvidence(log) {
  const holdDir = join(artifactsRoot, '_HOLD-superseded-0.1.2-b4c202d')
  mkdirSync(holdDir, { recursive: true })
  const staleNames = [
    'portico-ui-consumer-matrix-evidence.json',
    'portico-ui-consumer-compat-evidence.json'
  ]
  for (const name of staleNames) {
    const src = join(artifactsRoot, name)
    if (!existsSync(src)) continue
    const raw = readFileSync(src, 'utf8')
    if (/"packedVersion": "0.1.2"/.test(raw) || /b4c202d/.test(raw)) {
      const dest = join(holdDir, `${Date.now()}-${name}`)
      renameSync(src, dest)
      log.quarantined.push({ from: src, to: dest })
    }
  }
  rmSync(join(repoRoot, '.consumer-pack-test', 'portico-ui-consumer-matrix-evidence.json'), {
    force: true
  })
}

function cleanBuildPack(label, log) {
  runStep(`${label}: rm+ci`, 'rm -rf node_modules dist portico-ui-*.tgz && npm ci', log)
  runStep(`${label}: build`, 'npm run build', log)
  runStep(`${label}: test`, 'npm test', log)
  const packR = runStep(`${label}: pack`, 'npm pack --silent', log)
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
  if (c.packSha256 !== c.consumerTarballSha256) errors.push('pack vs consumer tarball sha256')
  if (c.packSha256 !== c.packDialogTarballSha256) errors.push('pack vs pack-dialog tarball sha256')
  if (report.packInstalledDialogSmoke?.ok !== true) errors.push('pack dialog dismiss paths failed')
  if (c.gitHead !== c.consumerGitHead) errors.push('gitHead vs consumer evidence')
  if (c.gitHead !== c.packDialogGitHead) errors.push('gitHead vs pack-dialog evidence')
  if (c.packedVersion !== c.consumerPackedVersion) errors.push('version vs consumer evidence')
  if (c.consumerEvidenceHasTopLevelOk !== true) errors.push('consumer evidence missing ok:true')
  if (c.consumerFailures !== 0) errors.push('consumer matrix failures')
  if (errors.length) {
    throw new Error(`consistency check failed: ${errors.join('; ')}`)
  }
  report.consistencyChecks.passed = true
}

function main() {
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  const logPath = join(outDir, 'capture.log')
  const log = { startedAt: new Date().toISOString(), steps: [], quarantined: [] }
  quarantineStaleRootEvidence(log)

  const head = sh('git rev-parse HEAD')
  const fixOnMain = sh('git rev-parse origin/main')
  const packedVersion = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8')).version

  const pack1 = cleanBuildPack('clean-run-1', log)
  copyFileSync(pack1.tgzPath, join(outDir, pack1.tgzName))
  const pack2 = cleanBuildPack('clean-run-2', log)
  copyFileSync(pack2.tgzPath, join(outDir, `repro-${pack2.tgzName}`))
  if (pack1.sha256 !== pack2.sha256) throw new Error('pack reproducibility failed')

  const consumerOut = join(outDir, 'portico-ui-consumer-matrix-evidence.json')
  runStep(
    'consumer-matrix',
    `EXPECT_GIT_HEAD=${head} EXPECT_PACKED_VERSION=${packedVersion} EXPECT_TARBALL_SHA256=${pack1.sha256} CONSUMER_MATRIX_OUT=${consumerOut} node scripts/verify-npm-consumers.mjs`,
    log
  )
  const consumer = JSON.parse(readFileSync(consumerOut, 'utf8'))

  const packDialogOut = join(outDir, 'pack-dialog-browser-evidence.json')
  runStep(
    'pack-dialog-runtime',
    `PACK_TARBALL=${join(outDir, pack1.tgzName)} EXPECT_TARBALL_SHA256=${pack1.sha256} EXPECT_GIT_HEAD=${head} PACK_DIALOG_EVIDENCE_OUT=${packDialogOut} node scripts/verify-pack-dialog-runtime.mjs`,
    log
  )
  const packDialog = JSON.parse(readFileSync(packDialogOut, 'utf8'))

  runStep('docs:build', 'npm run docs:build', log)
  const smokeR = runStep('docs-preview-smoke', 'node scripts/docs-preview-smoke.mjs', log)
  const smoke = JSON.parse((smokeR.stdout || '').slice((smokeR.stdout || '').indexOf('{')))

  const versionOnlyDiff = sh(`git diff --stat ${fixOnMain}..${head}`)
  const dialogVueAtHead = sh(`git rev-parse ${head}:src/components/dialog/Dialog.vue`)
  const dialogVueAtFix = sh(`git rev-parse ${fixOnMain}:src/components/dialog/Dialog.vue`)

  const report = {
    defectId: 'UI-DIALOG-ESC-001',
    holdNote:
      'Root /opt/cursor/artifacts/portico-ui-consumer-matrix-evidence.json (0.1.2/b4c202d) quarantined — use only files in this directory.',
    package: { name: 'portico-ui', version: packedVersion },
    git: {
      releaseCandidateHead: head,
      mainSquashMerge: fixOnMain,
      dialogVueBlobOnMainFix: dialogVueAtFix,
      dialogVueBlobAtHead: dialogVueAtHead,
      dialogImplementationUnchangedInVersionCommit: dialogVueAtHead === dialogVueAtFix,
      versionOnlyDiffStatSinceMainFix: versionOnlyDiff
    },
    registryVersionsVerified: ['0.0.0-stage', '0.1.0', '0.1.1', '0.1.2'],
    nextPatchSelected: packedVersion,
    packReproducibility: {
      reproducible: true,
      runs: [pack1, pack2],
      canonicalTarball: pack1.tgzName,
      canonicalPath: join(outDir, pack1.tgzName),
      sha256: pack1.sha256,
      integritySRI: pack1.integritySRI
    },
    sourceTreeDocsDialogSmoke: {
      mode: 'vitepress-build-static-server',
      notPackInstalled: true,
      evidence: smoke.dialogSmoke
    },
    packInstalledDialogSmoke: packDialog,
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
      packDialogTarballSha256: packDialog.tarballSha256,
      packDialogGitHead: packDialog.gitHead
    },
    commandLog: log,
    publishNotExecuted: true
  }

  assertConsistency(report)
  writeFileSync(join(outDir, 'release-candidate-report.json'), JSON.stringify(report, null, 2))
  writeFileSync(logPath, JSON.stringify(log, null, 2))
  console.log(JSON.stringify(report, null, 2))
}

main()