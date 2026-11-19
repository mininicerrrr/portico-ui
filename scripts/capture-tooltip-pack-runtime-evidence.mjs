#!/usr/bin/env node
/** Pack-runtime tooltip evidence: Vue 3.4.38 ESM + dist bundle, focus + tooltip panel union screenshot. */
import { createReadStream, existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve, join, extname } from 'node:path'
import { execSync } from 'node:child_process'
import { chromium } from 'playwright'
import { setTimeout as delay } from 'node:timers/promises'

const repoRoot = resolve(import.meta.dirname, '..')
const outDir = process.env.TOOLTIP_RUNTIME_EVIDENCE_DIR || '/opt/cursor/artifacts/v2-screenshots/tooltip-runtime-vue34'
const packDest = join(repoRoot, '.consumer-pack-test')

function gitHead() {
  return execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim()
}

function contentType(p) {
  const e = extname(p)
  if (e === '.html') return 'text/html; charset=utf-8'
  if (e === '.js') return 'text/javascript; charset=utf-8'
  if (e === '.css') return 'text/css; charset=utf-8'
  return 'application/octet-stream'
}

function startStatic(root) {
  return new Promise((resolveServer) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url || '/', 'http://localhost')
      const rel = url.pathname === '/' ? '/scripts/fixtures/pack-tooltip-harness.html' : url.pathname
      const file = join(root, rel.replace(/^\//, ''))
      if (!file.startsWith(root) || !existsSync(file)) {
        res.statusCode = 404
        res.end('not found')
        return
      }
      res.setHeader('Content-Type', contentType(file))
      createReadStream(file).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => resolveServer(server))
  })
}

async function main() {
  execSync('npm run build', { cwd: repoRoot, stdio: 'inherit' })
  await mkdir(packDest, { recursive: true })
  const packOut = execSync(`npm pack --pack-destination ${packDest}`, { cwd: repoRoot, encoding: 'utf8' }).trim()
  const tgzName = packOut.split('\n').pop()
  const tarballSha = execSync(`sha256sum ${join(packDest, tgzName)}`, { encoding: 'utf8' }).trim().split(/\s+/)[0]

  const server = await startStatic(repoRoot)
  const { port } = server.address()
  const url = `http://127.0.0.1:${port}/scripts/fixtures/pack-tooltip-harness.html`

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 900, height: 480 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('#ev-tip-a')
  await page.focus('#ev-tip-a')
  await page.evaluate(() => {
    const btn = document.getElementById('ev-tip-a')
    btn?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
  })
  await delay(400)

  const meta = await page.evaluate(() => {
    const panels = [...document.querySelectorAll('[id^="pt-tooltip-panel-"]')].map((el) => el.id)
    const trigger = document.querySelector('.pt-tooltip')
    const described = trigger?.getAttribute('aria-describedby')
    const panel = described ? document.getElementById(described) : null
    return {
      panelIds: panels,
      uniquePanels: new Set(panels).size === panels.length,
      describedBy: described,
      panelRole: panel?.getAttribute('role'),
      panelVisible: panel ? getComputedStyle(panel).display !== 'none' && !!panel.textContent?.length : false
    }
  })

  const clip = await page.evaluate(() => {
    const btn = document.getElementById('ev-tip-a')
    const panel = document.querySelector('[role="tooltip"]')
    if (!btn || !panel) return null
    const a = btn.getBoundingClientRect()
    const p = panel.getBoundingClientRect()
    const pad = 16
    const x = Math.min(a.left, p.left) - pad
    const y = Math.min(a.top, p.top) - pad
    const right = Math.max(a.right, p.right) + pad
    const bottom = Math.max(a.bottom, p.bottom) + pad
    return { x: Math.max(0, x), y: Math.max(0, y), width: right - Math.max(0, x), height: bottom - Math.max(0, y) }
  })

  await mkdir(outDir, { recursive: true })
  const shotPath = join(outDir, 'pack-vue34-tooltip-focus-panel-union.png')
  if (clip) await page.screenshot({ path: shotPath, clip })
  else await page.screenshot({ path: shotPath, fullPage: true })

  const evidence = {
    capturedAt: new Date().toISOString(),
    gitHead: gitHead(),
    tarballSha256: tarballSha,
    vue: '3.4.38',
    harness: url,
    meta,
    screenshots: [shotPath]
  }
  await writeFile(join(outDir, 'tooltip-runtime-evidence.json'), JSON.stringify(evidence, null, 2))
  console.log(JSON.stringify(evidence, null, 2))

  await browser.close()
  await new Promise((r) => server.close(r))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})