#!/usr/bin/env node
/**
 * Targeted final evidence: a11y keyboard PNGs + corrected 820px table + browser-loaded asset digests.
 * Does not re-run the full legacy visual matrix.
 */
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const repoRoot = resolve(import.meta.dirname, '..')
const outDir = process.env.V2_SCREENSHOT_DIR || '/opt/cursor/artifacts/v2-screenshots'
const BASE = process.env.V2_DOCS_BASE || 'http://127.0.0.1:5173/portico-ui'

async function sha256File(path) {
  const buf = await readFile(path)
  return createHash('sha256').update(buf).digest('hex')
}

async function sha256Url(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed ${url} ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  return createHash('sha256').update(buf).digest('hex')
}

function gitHead() {
  return execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim()
}

async function collectRuntimeEvidence(page) {
  const pkg = JSON.parse(await readFile(resolve(repoRoot, 'package.json'), 'utf8'))
  const distDigests = {}
  for (const rel of ['dist/style.css', 'dist/portico-ui.es.js']) {
    try {
      distDigests[rel] = await sha256File(resolve(repoRoot, rel))
    } catch {
      distDigests[rel] = null
    }
  }
  const resources = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .filter((e) => /\/assets\/|portico-ui|\.css|\.js/.test(e.name))
      .slice(-40)
      .map((e) => ({ name: e.name, initiatorType: e.initiatorType, transferSize: e.transferSize }))
  )
  const loaded = []
  for (const r of resources) {
    if (!r.name.startsWith('http')) continue
    try {
      loaded.push({ url: r.name, sha256: await sha256Url(r.name) })
    } catch (err) {
      loaded.push({ url: r.name, sha256: null, error: String(err) })
    }
  }
  const behavior = await page.evaluate(() => {
    const sortTh = document.querySelector('#v2-table-sorted-target th.is-sortable')
    const overflowCell = document.querySelector('#v2-table-states .pt-table__cell--overflow-focusable, #v2-table-tooltip .pt-table__cell--overflow-focusable')
    const lastTh = document.querySelector('#v2-table-states th:last-child')
    const lr = lastTh?.getBoundingClientRect()
    const table = document.querySelector('#v2-table-states .pt-table__table')?.getBoundingClientRect()
    return {
      sortHeaderTabIndex: sortTh?.getAttribute('tabindex'),
      overflowCellTabIndex: overflowCell?.getAttribute('tabindex'),
      tableStatesLastHeaderRight: lr?.right,
      tableStatesTableRight: table?.right,
      tableStatesTableWidth: table?.width
    }
  })
  return {
    capturedAt: new Date().toISOString(),
    gitHead: gitHead(),
    packageName: pkg.name,
    packageVersionPrepared: pkg.version,
    notePreparedNotPublished: 'package.json version is release prep only; not npm published',
    distFileSha256: distDigests,
    browserLoadedAssetSha256: loaded,
    runtimeBehaviorSample: behavior,
    tarballIdentityNote: 'Tarball byte hash does not prove browser load; use browserLoadedAssetSha256'
  }
}

async function main() {
  await mkdir(outDir, { recursive: true })
  execSync(
    `V2_CAPTURE_ONLY=live-v2-table-states.png node scripts/capture-v2-screenshots.mjs`,
    { cwd: repoRoot, stdio: 'inherit', env: { ...process.env, V2_SCREENSHOT_DIR: outDir } }
  )
  execSync(`node scripts/capture-a11y-keyboard.mjs`, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, A11Y_EVIDENCE_DIR: resolve(outDir, 'a11y-keyboard') }
  })

  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${BASE}/guide/visual-v2`, { waitUntil: 'networkidle', timeout: 60000 })
  const runtime = await collectRuntimeEvidence(page)
  await browser.close()

  const evidencePath = resolve(outDir, 'capture-runtime-evidence.json')
  await writeFile(evidencePath, JSON.stringify(runtime, null, 2))

  let manifest = {}
  try {
    manifest = JSON.parse(await readFile(resolve(outDir, 'capture-manifest.json'), 'utf8'))
  } catch {
    /* */
  }
  manifest.captureRuntimeEvidence = evidencePath
  manifest.a11yKeyboardEvidence = [
    resolve(outDir, 'a11y-keyboard/keyboard-sort-header-focus.png'),
    resolve(outDir, 'a11y-keyboard/keyboard-overflow-cell-focus-tooltip.png')
  ]
  manifest.gitHeadAtFinalEvidence = gitHead()
  manifest.packageVersionPrepared = runtime.packageVersionPrepared
  await writeFile(resolve(outDir, 'capture-manifest.json'), JSON.stringify(manifest, null, 2))

  console.log(JSON.stringify({ ok: true, gitHead: gitHead(), evidencePath, outDir }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})