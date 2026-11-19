#!/usr/bin/env node
/** Browser-loaded asset digests from static docs preview (port 4173); no full screenshot matrix. */
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const repoRoot = resolve(import.meta.dirname, '..')
const outDir = process.env.V2_SCREENSHOT_DIR || '/opt/cursor/artifacts/v2-screenshots'
const BASE = 'http://127.0.0.1:4173/portico-ui'

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

async function main() {
  await mkdir(outDir, { recursive: true })
  try {
    execSync('lsof -ti:4173 | xargs -r kill -9', { stdio: 'ignore' })
  } catch {
    /* ok */
  }
  const server = spawn('node', ['scripts/static-docs-server.mjs'], { cwd: repoRoot, stdio: 'ignore' })
  await delay(500)
  const pkg = JSON.parse(await readFile(resolve(repoRoot, 'package.json'), 'utf8'))
  const distDigests = {}
  for (const rel of ['dist/style.css', 'dist/portico-ui.es.js']) {
    distDigests[rel] = await sha256File(resolve(repoRoot, rel))
  }
  const tarballPath = process.env.TARBALL_PATH || '/opt/cursor/artifacts/portico-ui-0.1.1.tgz'
  let tarballSha256 = null
  try {
    tarballSha256 = await sha256File(tarballPath)
  } catch {
    /* optional */
  }

  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${BASE}/guide/visual-v2#v2-table-tooltip`, { waitUntil: 'networkidle', timeout: 60000 })
  const resources = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .filter((e) => /\/assets\/|portico-ui|\.css|\.js/.test(e.name))
      .map((e) => ({ name: e.name, initiatorType: e.initiatorType, transferSize: e.transferSize }))
  )
  const loaded = []
  for (const r of resources) {
    if (!r.name.startsWith('http')) continue
    try {
      loaded.push({ url: r.name, sha256: await sha256Url(r.name) })
    } catch (err) {
      loaded.push({ url: r.name, error: String(err) })
    }
  }
  await browser.close()
  server.kill('SIGTERM')

  const evidence = {
    capturedAt: new Date().toISOString(),
    implementationSourceCommitSha: gitHead(),
    packageName: pkg.name,
    packageVersionPrepared: pkg.version,
    notePreparedNotPublished: 'package.json version is release prep only; not npm published',
    distFileSha256: distDigests,
    browserLoadedAssetSha256: loaded,
    tarball: tarballPath,
    tarballSha256,
    tarballIdentityNote:
      'Tarball byte hash does not prove browser load; correlate distFileSha256 and browserLoadedAssetSha256',
    docsServeBase: BASE
  }
  const evidencePath = resolve(outDir, 'capture-runtime-evidence.json')
  await writeFile(evidencePath, JSON.stringify(evidence, null, 2))
  console.log(JSON.stringify({ ok: true, evidencePath, gitHead: gitHead(), tarballSha256 }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})