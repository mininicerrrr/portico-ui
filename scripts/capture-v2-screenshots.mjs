import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const root = resolve(import.meta.dirname, '..')
const outDir = '/opt/cursor/artifacts/v2-screenshots'
const routes = [
  { name: 'live-visual-v2-page', path: '/guide/visual-v2.html' },
  { name: 'live-button-doc', path: '/components/button.html' },
  { name: 'live-table-doc', path: '/components/table.html' },
]

async function waitForServer(url, maxMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {
      /* retry */
    }
    await delay(400)
  }
  throw new Error(`Preview server did not start: ${url}`)
}

const preview = spawn('npx', ['vitepress', 'preview', 'docs', '--host', '127.0.0.1', '--port', '4173'], {
  cwd: root,
  stdio: 'ignore'
})

try {
  await waitForServer('http://127.0.0.1:4173/')
  const { chromium } = await import('playwright')
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto('http://127.0.0.1:4173/guide/visual-v2.html', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready
  })
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:4173${route.path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready
    })
    await page.screenshot({ path: resolve(outDir, `${route.name}.png`), fullPage: true })
  }
  const fontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily)
  await page.screenshot({ path: resolve(outDir, 'live-composition-full.png'), fullPage: true })
  console.log(JSON.stringify({ outDir, fontFamily, routes: routes.map((r) => r.name) }))
  await browser.close()
} finally {
  preview.kill('SIGTERM')
}