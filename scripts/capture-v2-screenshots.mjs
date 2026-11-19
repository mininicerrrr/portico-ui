#!/usr/bin/env node
/**
 * Capture live VitePress proof screenshots. Requires: npm run docs:build && vitepress preview.
 * Uses site base /portico-ui/ from docs/.vitepress/config.ts
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/** VitePress `preview` currently 404s hashed assets with `base: /portico-ui/` — use `vitepress dev` on :5173. */
const BASE = process.env.V2_DOCS_BASE || 'http://127.0.0.1:5173/portico-ui'
const outDir = process.env.V2_SCREENSHOT_DIR || '/opt/cursor/artifacts/v2-screenshots'

const shots = [
  { file: 'live-v2-composition.png', path: '/guide/visual-v2', anchor: '#v2-composition', expectSelector: '#v2-composition .pt-input' },
  { file: 'live-v2-buttons.png', path: '/guide/visual-v2', anchor: '#v2-buttons', expectText: '保存中', focusSelector: '.pt-button--primary' },
  { file: 'live-v2-inputs.png', path: '/guide/visual-v2', anchor: '#v2-inputs', expectSelector: '#v2-inputs .pt-input.is-disabled, #v2-inputs .pt-input.is-disabled .pt-input__inner' },
  { file: 'live-v2-table-loading.png', path: '/guide/visual-v2', anchor: '#v2-table-loading', expectSelector: '.pt-table__skeleton-row' },
  { file: 'live-v2-dark.png', path: '/guide/visual-v2', anchor: '#v2-dark', expectSelector: '[data-pt-theme="dark"] .pt-table__skeleton-cell' },
]

async function assertPage(page, { expectText, expectSelector }) {
  const body = await page.textContent('body')
  if (body?.includes('PAGE NOT FOUND') || body?.includes('404')) {
    throw new Error('Got VitePress 404 – check BASE path (must include /portico-ui/)')
  }
  if (expectText && !body?.includes(expectText)) {
    throw new Error(`Missing expected text: ${expectText}`)
  }
  if (expectSelector && !(await page.locator(expectSelector).count())) {
    throw new Error(`Missing selector: ${expectSelector}`)
  }
  if (!(await page.locator('.pt-button').count())) {
    throw new Error('No .pt-button on page – not live Portico components')
  }
}

async function fontEvidence(page) {
  await page.evaluate(async () => {
    if (document.fonts?.load) {
      await document.fonts.load('500 14px "Noto Sans SC"')
      await document.fonts.load('400 14px "Noto Sans SC"')
      await document.fonts.ready
    }
  })
  return page.evaluate(() => {
    const el =
      [...document.querySelectorAll('.pt-button')].find((n) => /[\u4e00-\u9fff]/.test(n.textContent || '')) ||
      document.querySelector('.pt-input__inner') ||
      document.querySelector('.pt-button') ||
      document.body
    const cs = getComputedStyle(el)
    const families = (document.fonts && [...document.fonts].slice(0, 8).map((f) => f.family)) || []
    const notoLoaded = document.fonts ? document.fonts.check('500 14px "Noto Sans SC"') : false
    const usesNoto = /Noto Sans SC/i.test(cs.fontFamily)
    return {
      fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight,
      notoLoaded,
      usesNoto,
      fontFacesSample: families
    }
  })
}

async function main() {
  const { chromium } = await import('playwright')
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const evidence = []

  for (const shot of shots) {
    const url = `${BASE}${shot.path}${shot.anchor || ''}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.pt-button', { timeout: 30000 })
    await page.waitForFunction(() => document.querySelectorAll('.pt-input, .pt-table').length > 0, { timeout: 30000 })
    await page.waitForTimeout(1200)
    await assertPage(page, shot)
    if (shot.focusSelector) {
      const target = page.locator(shot.focusSelector).first()
      await target.focus()
      await page.waitForTimeout(200)
    }
    const font = await fontEvidence(page)
    const out = resolve(outDir, shot.file)
    if (shot.anchor) {
      const el = page.locator(shot.anchor)
      if (await el.count()) {
        await el.screenshot({ path: out })
      } else {
        await page.screenshot({ path: out, fullPage: true })
      }
    } else {
      await page.screenshot({ path: out, fullPage: true })
    }
    if (!font.usesNoto) {
      throw new Error(`Noto Sans SC not in computed font-family (got ${font.fontFamily}, loaded=${font.notoLoaded})`)
    }
    evidence.push({ url, file: shot.file, font, title: await page.title() })
  }

  await writeFile(resolve(outDir, 'capture-evidence.json'), JSON.stringify({ base: BASE, evidence }, null, 2))
  console.log(JSON.stringify({ ok: true, outDir, evidence }, null, 2))
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})