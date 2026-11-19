#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const BASE = process.env.V2_DOCS_BASE || 'http://127.0.0.1:5173/portico-ui'
const outDir = process.env.V2_SCREENSHOT_DIR || '/opt/cursor/artifacts/v2-screenshots'

const shots = [
  { file: 'live-v2-composition.png', anchor: '#v2-composition', expectSelector: '#v2-composition .pt-pagination' },
  { file: 'live-v2-buttons.png', anchor: '#v2-buttons', focusSelector: '#v2-buttons .pt-button--primary' },
  { file: 'live-v2-inputs.png', anchor: '#v2-inputs', expectSelector: '#v2-inputs .pt-input' },
  { file: 'live-v2-table-states.png', anchor: '#v2-table-states', expectSelector: '#v2-table-states .pt-table' },
  { file: 'live-v2-table-loading.png', anchor: '#v2-table-loading', expectSelector: '#v2-table-loading .pt-table__skeleton-row' },
  { file: 'live-v2-dark.png', anchor: '#v2-dark', expectSelector: '#v2-dark .pt-table__skeleton-cell' },
]

async function assertPage(page, shot) {
  const body = await page.textContent('body')
  if (body?.includes('PAGE NOT FOUND')) throw new Error('VitePress 404')
  if (shot.expectSelector && !(await page.locator(shot.expectSelector).count())) {
    throw new Error(`Missing ${shot.expectSelector}`)
  }
  const layout = await page.evaluate((sel) => {
    const table = document.querySelector(`${sel} .pt-table__table`) || document.querySelector('.pt-table__table')
    if (!table) return null
    const cs = getComputedStyle(table)
    const sk = document.querySelector(`${sel} .pt-table__skeleton-cell`) || document.querySelector('.pt-table__skeleton-cell')
    return {
      display: cs.display,
      width: cs.width,
      skeletonBg: sk ? getComputedStyle(sk).backgroundColor : null
    }
  }, shot.anchor)
  if (layout && layout.display !== 'table') {
    throw new Error(`Host/layout: table display is ${layout.display}, expected table`)
  }
}

async function fontEvidence(page, anchor) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready
  })
  return page.evaluate((sel) => {
    const el =
      document.querySelector(`${sel} .pt-button`) ||
      document.querySelector('.pt-button') ||
      document.body
    const cs = getComputedStyle(el)
    return {
      fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight,
      usesNoto: /Noto Sans SC/i.test(cs.fontFamily),
      notoLoaded: document.fonts?.check('500 14px "Noto Sans SC"') ?? false
    }
  }, anchor)
}

async function main() {
  const { chromium } = await import('playwright')
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } })
  const evidence = []

  for (const shot of shots) {
    const url = `${BASE}/guide/visual-v2${shot.anchor}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.pt-table__table, .pt-button', { timeout: 30000 })
    await page.waitForTimeout(800)
    await assertPage(page, shot)
    if (shot.focusSelector) {
      await page.locator(shot.focusSelector).first().focus()
      await page.waitForTimeout(200)
    }
    const font = await fontEvidence(page, shot.anchor)
    if (!font.usesNoto) throw new Error(`Noto missing: ${font.fontFamily}`)
    const loc = page.locator(shot.anchor)
    await (await loc.count() ? loc : page).screenshot({ path: resolve(outDir, shot.file) })
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