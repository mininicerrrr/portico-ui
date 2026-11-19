#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

const BASE = process.env.V2_DOCS_BASE || 'http://127.0.0.1:5173/portico-ui'
const outDir = process.env.V2_SCREENSHOT_DIR || '/opt/cursor/artifacts/v2-screenshots'
const VIEWPORT = { width: 1280, height: 1200 }
const DPR = 1

function gitSha() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}

const shots = [
  {
    file: 'live-v2-composition.png',
    anchor: '#v2-composition',
    setup: null,
    state: 'Static populated table at 584px content width; columns use explicit width + showOverflowTooltip',
    metrics: ['table', 'primaryButton']
  },
  {
    file: 'live-v2-buttons.png',
    anchor: '#v2-buttons',
    setup: null,
    state: 'Idle primary, neutral disabled primary, labeled loading (保存中), secondary, text',
    metrics: ['primaryButton', 'disabledPrimary', 'loadingPrimary']
  },
  {
    file: 'live-v2-buttons-focus.png',
    anchor: '#v2-buttons-focus',
    setup: async (page) => {
      await page.locator('#v2-btn-focus-target').focus()
    },
    state: 'Keyboard focus-visible on primary (#v2-btn-focus-target)',
    metrics: ['focusButton']
  },
  {
    file: 'live-v2-buttons-hover.png',
    anchor: '#v2-buttons-hover',
    setup: async (page) => {
      await page.locator('#v2-btn-hover-secondary').hover()
    },
    state: 'Mouse hover on default secondary',
    metrics: ['hoverButton']
  },
  {
    file: 'live-v2-buttons-dark.png',
    anchor: '#v2-buttons-dark',
    setup: null,
    state: 'Dark neutral disabled + labeled primary loading',
    metrics: ['darkLoadingPrimary', 'darkDisabledPrimary']
  },
  {
    file: 'live-v2-inputs.png',
    anchor: '#v2-inputs',
    setup: async (page) => {
      await page.locator('#v2-input-focus-field').focus()
    },
    state: 'Placeholder, focused filled input, FormItem error with helper text',
    metrics: ['input', 'errorInput', 'formMessage']
  },
  {
    file: 'live-v2-input-async.png',
    anchor: '#v2-input-async',
    setup: null,
    state: 'Suffix slot spinner demo (no built-in PtInput.loading prop)',
    metrics: ['inputSuffix']
  },
  {
    file: 'live-v2-inputs-dark.png',
    anchor: '#v2-inputs-dark',
    setup: null,
    state: 'Dark FormItem error + disabled input',
    metrics: ['darkErrorInput']
  },
  {
    file: 'live-v2-table-sorted.png',
    anchor: '#v2-table-sorted',
    setup: async (page) => {
      const th = page.locator('#v2-table-sorted-target th').first()
      await th.click()
      await th.click()
      await page.locator('#v2-table-sorted-target tbody tr').nth(1).click()
    },
    state: 'Descending sort on 成员 + current row on row 2',
    metrics: ['sortHeader', 'currentRow']
  },
  {
    file: 'live-v2-table-hover.png',
    anchor: '#v2-table-hover',
    setup: async (page) => {
      await page.locator('#v2-table-hover-target tbody tr').first().hover()
    },
    state: 'Row hover background on row 1',
    metrics: ['hoverRow']
  },
  {
    file: 'live-v2-table-tooltip.png',
    anchor: '#v2-table-tooltip',
    setup: async (page) => {
      await page.locator('#v2-table-tooltip tbody .pt-table__cell').first().hover()
      await page.waitForFunction(
        () =>
          [...document.querySelectorAll('#v2-table-tooltip .pt-tooltip__panel')].some((el) =>
            el.textContent?.includes('品牌资产')
          ),
        { timeout: 8000 }
      )
    },
    state: 'Tooltip visible for ellipsized long member name',
    metrics: ['tooltipPanel', 'ellipsisCell']
  },
  {
    file: 'live-v2-table-states.png',
    anchor: '#v2-table-states',
    setup: null,
    state: 'Empty table + recovery action at wider workbench',
    metrics: ['table']
  },
  {
    file: 'live-v2-table-loading.png',
    anchor: '#v2-table-loading',
    setup: null,
    state: 'Light skeleton + loading pill',
    metrics: ['skeleton']
  },
  {
    file: 'live-v2-dark.png',
    anchor: '#v2-dark',
    setup: null,
    state: 'Dark toolbar + full-width loading table',
    metrics: ['skeleton', 'darkSurface']
  }
]

async function measure(page, anchor, keys) {
  return page.evaluate(
    ({ anchorId, keys: metricKeys }) => {
      const root = document.querySelector(anchorId) || document
      const pick = (sel) => root.querySelector(sel) || document.querySelector(sel)
      const rect = (el) => (el ? el.getBoundingClientRect() : null)
      const cs = (el) => (el ? getComputedStyle(el) : null)
      const out = {}
      const fontProbe = (el, label) => {
        if (!el) return null
        const s = cs(el)
        return {
          selector: label,
          fontFamily: s.fontFamily,
          fontWeight: s.fontWeight,
          fontSize: s.fontSize,
          loaded400: document.fonts?.check('400 14px "Noto Sans SC"') ?? null,
          loaded500: document.fonts?.check('500 14px "Noto Sans SC"') ?? null
        }
      }
      if (metricKeys.includes('table')) {
        const table = pick('.pt-table__table')
        const s = cs(table)
        out.table = {
          display: s?.display,
          width: s?.width,
          tableLayout: s?.tableLayout
        }
      }
      if (metricKeys.includes('primaryButton')) {
        const btn = pick('.pt-button--primary:not(.is-loading):not(:disabled)')
        const s = cs(btn)
        const r = rect(btn)
        out.primaryButton = {
          backgroundColor: s?.backgroundColor,
          borderRadius: s?.borderRadius,
          height: r?.height,
          font: fontProbe(btn, '.pt-button--primary')
        }
      }
      if (metricKeys.includes('disabledPrimary')) {
        const btn = pick('.pt-button--primary.is-disabled, .pt-button--primary:disabled:not(.is-loading)')
        const s = cs(btn)
        out.disabledPrimary = { backgroundColor: s?.backgroundColor, color: s?.color, borderColor: s?.borderColor }
      }
      if (metricKeys.includes('loadingPrimary')) {
        const btn = pick('.pt-button--primary.is-loading')
        const s = cs(btn)
        const content = pick('.pt-button--primary.is-loading .pt-button__content')
        const contentCs = cs(content)
        out.loadingPrimary = {
          backgroundColor: s?.backgroundColor,
          color: s?.color,
          labelVisibility: contentCs?.visibility,
          labelOpacity: contentCs?.opacity,
          labelText: content?.textContent?.trim(),
          spinnerSize: pick('.pt-button--primary.is-loading .pt-button__spinner')?.getBoundingClientRect()?.width
        }
      }
      if (metricKeys.includes('focusButton')) {
        const btn = pick('#v2-btn-focus-target') || pick('.pt-button:focus-visible')
        out.focusButton = { boxShadow: cs(btn)?.boxShadow }
      }
      if (metricKeys.includes('hoverButton')) {
        const btn = pick('#v2-btn-hover-secondary')
        out.hoverButton = { backgroundColor: cs(btn)?.backgroundColor }
      }
      if (metricKeys.includes('darkLoadingPrimary')) {
        const btn = pick('[data-pt-theme="dark"] .pt-button--primary.is-loading, .v2-dark-surface .pt-button--primary.is-loading')
        out.darkLoadingPrimary = {
          backgroundColor: cs(btn)?.backgroundColor,
          labelText: pick('.v2-dark-surface .pt-button--primary.is-loading .pt-button__content')?.textContent?.trim()
        }
      }
      if (metricKeys.includes('darkDisabledPrimary')) {
        const btn = pick('.v2-dark-surface .pt-button--primary.is-disabled')
        out.darkDisabledPrimary = { backgroundColor: cs(btn)?.backgroundColor, color: cs(btn)?.color }
      }
      if (metricKeys.includes('input')) {
        const inp = pick('.pt-input')
        out.input = { borderRadius: cs(inp)?.borderRadius, borderWidth: cs(inp)?.borderWidth, font: fontProbe(inp, '.pt-input') }
      }
      if (metricKeys.includes('errorInput')) {
        const inp = pick('.pt-form-item .pt-input') || pick('.pt-input.is-error')
        out.errorInput = { borderColor: cs(inp)?.borderColor }
      }
      if (metricKeys.includes('formMessage')) {
        const msg = pick('.pt-form-item__error')
        out.formMessage = { text: msg?.textContent?.trim(), color: cs(msg)?.color }
      }
      if (metricKeys.includes('sortHeader')) {
        const icon = pick('.pt-table__sort .is-active')
        out.sortHeader = { activeSortColor: cs(icon)?.color }
      }
      if (metricKeys.includes('currentRow')) {
        const row = pick('tbody tr.is-current td')
        out.currentRow = { backgroundColor: cs(row)?.backgroundColor }
      }
      if (metricKeys.includes('hoverRow')) {
        const row = pick('#v2-table-hover-target tbody tr:first-child td')
        out.hoverRow = { backgroundColor: cs(row)?.backgroundColor }
      }
      if (metricKeys.includes('tooltipPanel')) {
        const panel = document.querySelector('.pt-tooltip__panel')
        out.tooltipPanel = { visible: Boolean(panel), text: panel?.textContent?.trim() }
      }
      if (metricKeys.includes('ellipsisCell')) {
        const cell = pick('.pt-table__cell')
        const s = cs(cell)
        out.ellipsisCell = { textOverflow: s?.textOverflow, whiteSpace: s?.whiteSpace }
      }
      if (metricKeys.includes('skeleton')) {
        const sk = pick('.pt-table__skeleton-cell')
        out.skeleton = { fill: cs(sk)?.backgroundColor, width: cs(pick('.pt-table__table'))?.width }
      }
      if (metricKeys.includes('darkSurface')) {
        const el = pick('.v2-dark-surface')
        out.darkSurface = { width: cs(el)?.width }
      }
      const row = pick('#v2-composition tbody tr')
      if (row && metricKeys.includes('table')) {
        const cells = row.querySelectorAll('td')
        const overlaps = []
        for (let i = 0; i < cells.length - 1; i++) {
          const a = cells[i].getBoundingClientRect()
          const b = cells[i + 1].getBoundingClientRect()
          if (a.right > b.left + 0.5) overlaps.push({ from: i, to: i + 1, gap: b.left - a.right })
        }
        out.cellBoundary = { overlapCount: overlaps.length, overlaps }
      }
      const th = pick('.pt-table th')
      if (th && metricKeys.includes('table')) {
        out.tableHeader = { font: fontProbe(th, 'th'), borderLeftWidth: cs(th)?.borderLeftWidth }
      }
      const tdBody = pick('tbody td')
      if (tdBody && metricKeys.includes('table')) {
        out.tableBody = { font: fontProbe(tdBody, 'td') }
      }
      return out
    },
    { anchorId: anchor, keys }
  )
}

async function assertBasics(page, shot) {
  const body = await page.textContent('body')
  if (body?.includes('PAGE NOT FOUND')) throw new Error('VitePress 404')
  const table = page.locator(`${shot.anchor} .pt-table__table`).first()
  if ((await table.count()) && (await table.evaluate((el) => getComputedStyle(el).display)) !== 'table') {
    throw new Error(`table display !== table at ${shot.anchor}`)
  }
  if (shot.file === 'live-v2-buttons.png') {
    const loading = page.locator(`${shot.anchor} .pt-button--primary.is-loading .pt-button__content`)
    const text = (await loading.textContent())?.trim()
    if (!text?.includes('保存中')) throw new Error('Loading label missing on primary button')
    const bg = await page.locator(`${shot.anchor} .pt-button--primary.is-loading`).evaluate((el) => getComputedStyle(el).backgroundColor)
    if (bg !== 'rgb(52, 115, 206)') throw new Error(`Loading primary bg expected #3473CE, got ${bg}`)
  }
}

async function behaviorChecks(page) {
  const loadingBtn = page.locator('#v2-buttons .pt-button--primary.is-loading').first()
  const disabledBtn = page.locator('#v2-buttons .pt-button--primary:disabled').first()
  const disabledClicks = []
  await disabledBtn.evaluate((el) => el.addEventListener('click', (e) => e.stopPropagation()))
  await loadingBtn.evaluate((el) => el.addEventListener('click', (e) => e.stopPropagation()))
  const ariaBusy = await loadingBtn.getAttribute('aria-busy')
  const loadingDisabled = await loadingBtn.isDisabled()
  const primaryDisabled = await disabledBtn.isDisabled()
  return {
    loadingButton: { ariaBusy, nativeDisabled: loadingDisabled, hasIsDisabledClass: await loadingBtn.evaluate((el) => el.classList.contains('is-disabled')) },
    disabledButton: { nativeDisabled: primaryDisabled, hasIsDisabledClass: await disabledBtn.evaluate((el) => el.classList.contains('is-disabled')) },
    sortEmit: 'covered by unit test table.spec.ts sort-change',
    unsupportedStates: [
      { component: 'PtInput', state: 'built-in loading prop', workaround: 'use suffix slot (see #v2-input-async)' },
      { component: 'PtButton', state: ':active pressed', note: 'captured via hover/focus; pressed pseudo optional in Playwright mousedown' }
    ]
  }
}

async function main() {
  const sha = gitSha()
  const buildId = process.env.V2_BUILD_ID || `local-${new Date().toISOString()}`
  const { chromium } = await import('playwright')
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DPR })
  const page = await context.newPage()
  await page.goto(`${BASE}/guide/visual-v2`, { waitUntil: 'networkidle', timeout: 60000 })
  const behaviors = await behaviorChecks(page)
  const evidence = []

  for (const shot of shots) {
    const url = `${BASE}/guide/visual-v2${shot.anchor}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.pt-button, .pt-table, .pt-input', { timeout: 30000 })
    if (shot.setup) await shot.setup(page)
    await page.waitForTimeout(400)
    await assertBasics(page, shot)
    const metrics = await measure(page, shot.anchor, shot.metrics)
    const loc = page.locator(shot.anchor)
    const box = await loc.boundingBox()
    await loc.screenshot({ path: resolve(outDir, shot.file) })
    evidence.push({
      file: shot.file,
      url,
      anchor: shot.anchor,
      stateSetup: shot.state,
      pngSize: box ? { width: Math.round(box.width), height: Math.round(box.height) } : null,
      metrics
    })
  }

  const manifest = {
    commitSha: sha,
    buildId,
    capturedAt: new Date().toISOString(),
    docsBase: BASE,
    viewportCss: VIEWPORT,
    devicePixelRatio: DPR,
    screenshots: evidence,
    behaviorChecks: behaviors,
    unsupportedOrDemoOnly: behaviors.unsupportedStates
  }
  await writeFile(resolve(outDir, 'capture-manifest.json'), JSON.stringify(manifest, null, 2))
  await writeFile(resolve(outDir, 'behavior-checks.json'), JSON.stringify(behaviors, null, 2))
  console.log(JSON.stringify({ ok: true, sha, outDir, shotCount: evidence.length }, null, 2))
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})