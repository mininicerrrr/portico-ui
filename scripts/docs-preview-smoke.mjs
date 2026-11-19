#!/usr/bin/env node
/** Smoke-test built docs via static server (GH Pages base path). */
import { spawn, execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const BASE = 'http://127.0.0.1:4173/portico-ui'
const checks = [
  { name: 'visual-v2 html', url: `${BASE}/guide/visual-v2`, expectStatus: 200, expectBody: '主场景组合' },
  { name: 'main css bundle', url: '', expectStatus: 200, resolveCssFrom: `${BASE}/guide/visual-v2` },
  { name: 'app js bundle', url: '', expectStatus: 200, resolveJsFrom: `${BASE}/guide/visual-v2` },
]

async function waitForPreview(maxMs = 25000) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(`${BASE}/guide/visual-v2`)
      if (res.ok) return
    } catch {
      /* retry */
    }
    await delay(400)
  }
  throw new Error('static docs server did not become ready')
}

function freePreviewPort() {
  try {
    execSync('lsof -ti:4173 | xargs -r kill -9', { stdio: 'ignore' })
  } catch {
    /* port already free */
  }
}

function extractAsset(html, pattern) {
  const match = html.match(pattern)
  return match ? match[1] : null
}

async function main() {
  freePreviewPort()
  await delay(300)
  const preview = spawn('node', ['scripts/static-docs-server.mjs'], { cwd: repoRoot, stdio: 'ignore' })
  try {
    await waitForPreview()
    const results = []
    const pageRes = await fetch(`${BASE}/guide/visual-v2`)
    const html = await pageRes.text()
    results.push({
      name: 'visual-v2 html',
      status: pageRes.status,
      ok: pageRes.ok && html.includes('主场景组合') && !html.includes('PAGE NOT FOUND')
    })
    const cssPath = extractAsset(html, /href="(\/portico-ui\/assets\/style\.[^"]+\.css)"/)
    const jsPath = extractAsset(html, /src="(\/portico-ui\/assets\/app\.[^"]+\.js)"/)
    for (const [label, path, key] of [
      ['main css bundle', cssPath, 'css'],
      ['app js bundle', jsPath, 'js']
    ]) {
      const url = path ? `http://127.0.0.1:4173${path}` : ''
      const res = url ? await fetch(url) : { status: 0, ok: false }
      results.push({ name: label, url, status: res.status, ok: res.ok, path })
    }
    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(`${BASE}/guide/visual-v2`, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.pt-table__table', { timeout: 30000 })
    const tableLayout = await page.evaluate(() => ({
      tableDisplay: getComputedStyle(document.querySelector('.pt-table__table')).display,
      tableWidth: getComputedStyle(document.querySelector('.pt-table__table')).width,
      thBorderLeft: getComputedStyle(document.querySelector('.pt-table__table th')).borderLeftWidth
    }))
    const a11y = await page.evaluate(() => {
      const sortable = document.querySelector('.pt-table th.is-sortable')
      const focusableCell = document.querySelector('.pt-table__cell--overflow-focusable')
      return {
        sortableHeaderTabIndex: sortable?.getAttribute('tabindex'),
        hasOverflowFocusableCell: Boolean(focusableCell)
      }
    })
    await browser.close()
    const staticServerOk = results.every((r) => r.ok) && tableLayout.tableDisplay === 'table'
    const payload = {
      ok: staticServerOk,
      runner: 'static-docs-server + Playwright',
      notVitepressDefaultPreview: true,
      vitepressDefaultLimitation: 'Run npm run docs:preview-vitepress-default for default vitepress preview base-path check',
      results,
      tableLayout,
      a11ySample: a11y
    }
    console.log(JSON.stringify(payload, null, 2))
    if (!staticServerOk) process.exit(1)
  } finally {
    preview.kill('SIGTERM')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})