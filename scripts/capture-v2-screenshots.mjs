#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

const repoRoot = resolve(import.meta.dirname, '..')
const BASE = process.env.V2_DOCS_BASE || 'http://127.0.0.1:5173/portico-ui'
const outDir = process.env.V2_SCREENSHOT_DIR || '/opt/cursor/artifacts/v2-screenshots'
const VIEWPORT = { width: 1280, height: 1200 }
const DPR = 1

/** Hide VitePress chrome only; demo/component DOM unchanged. */
const CHROME_HIDE_CSS = `
  .VPNav, .VPNavBar, .VPLocalNav, .VPDocAside, .VPDocFooter,
  .VPSkipLink, .VPBackdrop, .DocSearch { display: none !important; visibility: hidden !important; }
  .VPContent, .VPDoc, .content-container, main { padding-top: 0 !important; margin-top: 0 !important; }
  .VPDoc .container { padding-top: 12px !important; }
`

function gitInfo() {
  try {
    const commitSha = execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim()
    const commitShaShort = execSync('git rev-parse --short HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim()
    const porcelain = execSync('git status --porcelain', { cwd: repoRoot, encoding: 'utf8' }).trim()
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim()
    return {
      commitSha,
      commitShaShort,
      branch,
      worktreeClean: porcelain.length === 0,
      dirtyPaths: porcelain ? porcelain.split('\n').map((l) => l.slice(3)) : []
    }
  } catch {
    return { commitSha: 'unknown', commitShaShort: 'unknown', branch: 'unknown', worktreeClean: false, dirtyPaths: [] }
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
    state: 'Mouse hover on default secondary (#v2-btn-hover-secondary)',
    metrics: ['hoverButton']
  },
  {
    file: 'live-v2-buttons-pressed.png',
    anchor: '#v2-buttons-pressed',
    setup: async (page) => {
      const btn = page.locator('#v2-btn-pressed-target')
      const box = await btn.boundingBox()
      if (!box) throw new Error('pressed target missing layout')
      const x = box.x + box.width / 2
      const y = box.y + box.height / 2
      await page.mouse.move(x, y)
      await page.mouse.down()
      await page.waitForTimeout(80)
    },
    teardown: async (page) => {
      await page.mouse.up()
    },
    verify: async (page) => {
      const btn = page.locator('#v2-btn-pressed-target')
      const bg = await btn.evaluate((el) => getComputedStyle(el).backgroundColor)
      const fg = await btn.locator('.pt-button__content').evaluate((el) => getComputedStyle(el).color)
      const idle = 'rgb(52, 115, 206)'
      if (bg === idle) {
        throw new Error('Pressed state not applied: background still idle primary blue')
      }
      const nums = bg.match(/\d+/g)?.map(Number)
      if (!nums || nums[0] >= 52) {
        throw new Error(`Pressed primary should darken from idle #3473CE, got ${bg}`)
      }
      if (fg !== 'rgb(255, 255, 255)') {
        throw new Error(`Pressed primary label must stay --pt-text-inverse (white), got ${fg}`)
      }
    },
    state: 'Primary :active via Playwright mouse.down() on #v2-btn-pressed-target; computed bg darker than idle',
    metrics: ['pressedButton']
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
    metrics: ['input', 'errorInput', 'formMessage', 'focusInput']
  },
  {
    file: 'live-v2-input-async.png',
    anchor: '#v2-input-async',
    setup: null,
    verify: async (page) => {
      const spin = page.locator('#v2-input-async .pt-input__suffix svg.pt-spinner')
      const box = await spin.boundingBox()
      if (!box || box.width < 8) throw new Error('Async suffix spinner has no visible box in light capture')
    },
    state: 'Suffix slot spinner visible beside retained value',
    metrics: ['inputSuffix']
  },
  {
    file: 'live-v2-input-async-dark.png',
    anchor: '#v2-input-async-dark',
    setup: null,
    verify: async (page) => {
      const spin = page.locator('#v2-input-async-dark .pt-input__suffix svg.pt-spinner')
      const box = await spin.boundingBox()
      if (!box || box.width < 8) throw new Error('Dark async suffix spinner not visible')
    },
    state: 'Dark suffix spinner beside retained value',
    metrics: ['inputSuffixDark']
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
    verify: async (page) => {
      const bg = await page
        .locator('#v2-table-sorted-target tbody tr.is-current td')
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor)
      if (bg !== 'rgb(237, 244, 255)') throw new Error(`Current row expected #EDF4FF, got ${bg}`)
    },
    state: 'Descending sort on 成员 + current row on row 2 (#EDF4FF)',
    metrics: ['sortHeader', 'currentRow']
  },
  {
    file: 'live-v2-table-hover.png',
    anchor: '#v2-table-hover',
    setup: async (page) => {
      await page.locator('#v2-table-hover-target tbody tr').first().hover()
    },
    verify: async (page) => {
      const bg = await page
        .locator('#v2-table-hover-target tbody tr')
        .first()
        .locator('td')
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor)
      if (bg !== 'rgb(247, 249, 252)') throw new Error(`Hover row expected #F7F9FC, got ${bg}`)
    },
    state: 'Row hover background on row 1 (#F7F9FC)',
    metrics: ['hoverRow']
  },
  {
    file: 'live-v2-table-tooltip.png',
    anchor: '#v2-table-tooltip',
    setup: async (page) => {
      const cell = page.locator('#v2-table-tooltip tbody .pt-table__cell').first()
      await cell.hover()
      await page.waitForTimeout(400)
    },
    state: 'Tooltip panel teleported to body; union clip of #v2-table-tooltip + visible [role=tooltip]',
    unionCapture: true,
    panelMatch: '品牌资产协作规范',
    metrics: ['tooltipPanel', 'ellipsisCell']
  },
  {
    file: 'live-v2-table-states.png',
    anchor: '#v2-table-states',
    setup: null,
    state: '820px populated wide table with members',
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
    verify: async (page) => {
      const lastHeader = (await page.locator('#v2-dark th').last().textContent())?.trim() ?? ''
      if (!lastHeader.includes('更新时间')) throw new Error(`Dark table last header clipped: "${lastHeader}"`)
    },
    state: 'Dark toolbar + full-width loading table (584px box, headers readable)',
    metrics: ['skeleton', 'darkSurface']
  }
]

const TARGETED_CAPTURE_LIST = [
  'live-v2-buttons-pressed.png',
  'live-v2-table-tooltip.png',
  'live-v2-table-hover.png',
  'live-v2-table-sorted.png',
  'live-v2-input-async.png',
  'live-v2-input-async-dark.png',
  'live-v2-dark.png',
  'live-v2-table-states.png'
].join(',')

async function hideDocChrome(page) {
  await page.evaluate((css) => {
    const id = 'v2-capture-chrome-hide'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id
      s.textContent = css
      document.head.appendChild(s)
    }
  }, CHROME_HIDE_CSS)
}

async function frameDemo(page, anchor) {
  await hideDocChrome(page)
  const loc = page.locator(anchor)
  await loc.scrollIntoViewIfNeeded()
  await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' })
    window.scrollBy(0, -4)
  }, anchor)
  await page.waitForTimeout(150)
}

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
        const r = rect(table)
        out.table = {
          display: s?.display,
          width: s?.width,
          tableLayout: s?.tableLayout,
          borderCollapse: s?.borderCollapse,
          boxWidth: r?.width
        }
      }
      if (metricKeys.includes('primaryButton')) {
        const btn = pick('.pt-button--primary:not(.is-loading):not(:disabled)')
        const s = cs(btn)
        const r = rect(btn)
        out.primaryButton = {
          backgroundColor: s?.backgroundColor,
          borderRadius: s?.borderRadius,
          borderWidth: s?.borderWidth,
          height: r?.height,
          width: r?.width,
          font: fontProbe(btn, '.pt-button--primary')
        }
      }
      if (metricKeys.includes('disabledPrimary')) {
        const btn = pick('.pt-button--primary.is-disabled, .pt-button--primary:disabled:not(.is-loading)')
        const s = cs(btn)
        out.disabledPrimary = {
          backgroundColor: s?.backgroundColor,
          color: s?.color,
          borderColor: s?.borderColor,
          borderRadius: s?.borderRadius,
          borderWidth: s?.borderWidth
        }
      }
      if (metricKeys.includes('loadingPrimary')) {
        const btn = pick('.pt-button--primary.is-loading')
        const s = cs(btn)
        const content = pick('.pt-button--primary.is-loading .pt-button__content')
        const contentCs = cs(content)
        out.loadingPrimary = {
          backgroundColor: s?.backgroundColor,
          color: s?.color,
          borderRadius: s?.borderRadius,
          labelVisibility: contentCs?.visibility,
          labelOpacity: contentCs?.opacity,
          labelText: content?.textContent?.trim(),
          spinnerSize: pick('.pt-button--primary.is-loading .pt-button__spinner')?.getBoundingClientRect()?.width
        }
      }
      if (metricKeys.includes('focusButton')) {
        const btn = pick('#v2-btn-focus-target') || pick('.pt-button:focus-visible')
        const s = cs(btn)
        out.focusButton = {
          boxShadow: s?.boxShadow,
          borderRadius: s?.borderRadius,
          backgroundColor: s?.backgroundColor
        }
      }
      if (metricKeys.includes('hoverButton')) {
        const btn = pick('#v2-btn-hover-secondary')
        const s = cs(btn)
        out.hoverButton = {
          backgroundColor: s?.backgroundColor,
          borderColor: s?.borderColor,
          borderRadius: s?.borderRadius
        }
      }
      if (metricKeys.includes('pressedButton')) {
        const btn = pick('#v2-btn-pressed-target')
        const s = cs(btn)
        const content = pick('#v2-btn-pressed-target .pt-button__content')
        out.pressedButton = {
          backgroundColor: s?.backgroundColor,
          color: cs(content)?.color,
          borderRadius: s?.borderRadius,
          expectedActiveToken: '#275aa3'
        }
      }
      if (metricKeys.includes('darkLoadingPrimary')) {
        const btn = pick('.v2-dark-surface .pt-button--primary.is-loading')
        out.darkLoadingPrimary = {
          backgroundColor: cs(btn)?.backgroundColor,
          labelText: pick('.v2-dark-surface .pt-button--primary.is-loading .pt-button__content')?.textContent?.trim(),
          borderRadius: cs(btn)?.borderRadius
        }
      }
      if (metricKeys.includes('darkDisabledPrimary')) {
        const btn = pick('.v2-dark-surface .pt-button--primary.is-disabled')
        out.darkDisabledPrimary = {
          backgroundColor: cs(btn)?.backgroundColor,
          color: cs(btn)?.color,
          borderColor: cs(btn)?.borderColor
        }
      }
      if (metricKeys.includes('input')) {
        const inp = pick('.pt-input')
        out.input = {
          borderRadius: cs(inp)?.borderRadius,
          borderWidth: cs(inp)?.borderWidth,
          borderColor: cs(inp)?.borderColor,
          font: fontProbe(inp, '.pt-input')
        }
      }
      if (metricKeys.includes('focusInput')) {
        const inner = document.getElementById('v2-input-focus-field')
        const inp = inner?.closest?.('.pt-input') || pick('.pt-input.is-focus')
        out.focusInput = {
          borderColor: cs(inp)?.borderColor,
          boxShadow: cs(inp)?.boxShadow,
          isFocusClass: inp?.classList.contains('is-focus')
        }
      }
      if (metricKeys.includes('errorInput')) {
        const inp = pick('.pt-form-item .pt-input')
        out.errorInput = {
          borderColor: cs(inp)?.borderColor,
          borderWidth: cs(inp)?.borderWidth,
          borderRadius: cs(inp)?.borderRadius
        }
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
        const panels = [...document.querySelectorAll('[role="tooltip"]')]
        const visible = panels.find((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 2 && r.height > 2 && el.textContent?.includes('品牌资产')
        })
        out.tooltipPanel = {
          visible: Boolean(visible),
          text: visible?.textContent?.trim(),
          width: visible ? rect(visible)?.width : null
        }
      }
      if (metricKeys.includes('ellipsisCell')) {
        const cell = pick('#v2-table-tooltip .pt-table__cell') || pick('.pt-table__cell')
        const s = cs(cell)
        out.ellipsisCell = { textOverflow: s?.textOverflow, whiteSpace: s?.whiteSpace, clientWidth: cell?.clientWidth }
      }
      if (metricKeys.includes('skeleton')) {
        const sk = pick('.pt-table__skeleton-cell')
        out.skeleton = {
          fill: cs(sk)?.backgroundColor,
          borderRadius: cs(sk)?.borderRadius,
          tableWidth: cs(pick('.pt-table__table'))?.width
        }
      }
      if (metricKeys.includes('darkSurface')) {
        const el = pick('.v2-dark-surface')
        out.darkSurface = { width: cs(el)?.width, borderRadius: cs(el)?.borderWidth }
      }
      const compRow = document.querySelector('#v2-composition tbody tr')
      if (compRow && metricKeys.includes('table')) {
        const cells = compRow.querySelectorAll('td')
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
        out.tableHeader = {
          font: fontProbe(th, 'th'),
          borderLeftWidth: cs(th)?.borderLeftWidth,
          borderBottomWidth: cs(th)?.borderBottomWidth
        }
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
  const nav = page.locator('.VPNav')
  if ((await nav.count()) && (await nav.isVisible())) {
    const box = await page.locator(shot.anchor).boundingBox()
    const navBox = await nav.boundingBox()
    if (box && navBox && box.y < navBox.bottom - 2) {
      throw new Error('Demo still under VPNav after chrome hide — adjust framing')
    }
  }
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
  if (shot.file === 'live-v2-table-tooltip.png') {
    const ok = await page.evaluate(() => {
      const panels = [...document.querySelectorAll('[role="tooltip"]')]
      return panels.some((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 2 && r.height > 2 && el.textContent?.includes('品牌资产协作规范')
      })
    })
    if (!ok) throw new Error('Long-text tooltip panel not visible before union screenshot')
  }
}

async function captureUnion(page, anchor, filePath, panelMatch) {
  const result = await page.evaluate(
    ({ sel, match }) => {
      const root = document.querySelector(sel)
      const panel = [...document.querySelectorAll('[role="tooltip"]')].find((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 2 && r.height > 2 && el.textContent?.includes(match)
      })
      if (!root || !panel) return null
      const boxes = [root.getBoundingClientRect(), panel.getBoundingClientRect()]
      const left = Math.min(...boxes.map((b) => b.left))
      const top = Math.min(...boxes.map((b) => b.top))
      const right = Math.max(...boxes.map((b) => b.right))
      const bottom = Math.max(...boxes.map((b) => b.bottom))
      const pad = 8
      const pr = panel.getBoundingClientRect()
      return {
        clip: {
          x: Math.max(0, left - pad),
          y: Math.max(0, top - pad),
          width: right - left + pad * 2,
          height: bottom - top + pad * 2
        },
        popupBounds: {
          x: pr.x,
          y: pr.y,
          width: pr.width,
          height: pr.height,
          text: panel.textContent?.trim()
        },
        targetBounds: root.getBoundingClientRect()
      }
    },
    { sel: anchor, match: panelMatch }
  )
  if (!result?.clip) throw new Error(`union capture failed for ${anchor}`)
  await page.screenshot({ path: filePath, clip: result.clip })
  return result
}

async function behaviorChecks(page) {
  const loadingBtn = page.locator('#v2-buttons .pt-button--primary.is-loading').first()
  const disabledBtn = page.locator('#v2-buttons .pt-button--primary:disabled').first()
  const ariaBusy = await loadingBtn.getAttribute('aria-busy')
  return {
    loadingButton: {
      ariaBusy,
      nativeDisabled: await loadingBtn.isDisabled(),
      hasIsDisabledClass: await loadingBtn.evaluate((el) => el.classList.contains('is-disabled'))
    },
    disabledButton: {
      nativeDisabled: await disabledBtn.isDisabled(),
      hasIsDisabledClass: await disabledBtn.evaluate((el) => el.classList.contains('is-disabled'))
    },
    pressedCapture: 'live-v2-buttons-pressed.png via mouse.down + computed #275AA3',
    sortEmit: 'covered by unit test table.spec.ts sort-change',
    unsupportedOrDemoOnly: [{ component: 'PtInput', state: 'built-in loading prop', workaround: 'suffix slot (#v2-input-async)' }]
  }
}

const SHOT_ORDER = shots.map((s) => s.file)

async function main() {
  const only = process.env.V2_CAPTURE_ONLY?.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const activeShots = only?.length ? shots.filter((s) => only.includes(s.file)) : shots
  const git = gitInfo()
  if (!git.worktreeClean) {
    console.warn(JSON.stringify({ warn: 'worktree not clean at capture start', dirtyPaths: git.dirtyPaths }))
  }
  const buildId = process.env.V2_BUILD_ID || `local-${new Date().toISOString()}`
  const { chromium } = await import('playwright')
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DPR })
  const page = await context.newPage()
  await page.goto(`${BASE}/guide/visual-v2`, { waitUntil: 'networkidle', timeout: 60000 })
  const behaviors = await behaviorChecks(page)
  const evidence = []
  const artifactPaths = []

  for (const shot of activeShots) {
    const url = `${BASE}/guide/visual-v2${shot.anchor}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.pt-button, .pt-table, .pt-input', { timeout: 30000 })
    await frameDemo(page, shot.anchor)
    if (shot.setup) await shot.setup(page)
    if (shot.verify) await shot.verify(page)
    await page.waitForTimeout(shot.teardown ? 80 : 300)
    await assertBasics(page, shot)
    const metrics = await measure(page, shot.anchor, shot.metrics)
    const loc = page.locator(shot.anchor)
    const filePath = resolve(outDir, shot.file)
    let pngSize = null
    let captureFraming = 'element: anchor only'
    let unionMeta = null
    if (shot.unionCapture) {
      unionMeta = await captureUnion(page, shot.anchor, filePath, shot.panelMatch)
      captureFraming = 'viewport clip: demo anchor ∪ teleported tooltip panel'
      pngSize = {
        width: Math.round(unionMeta.clip.width),
        height: Math.round(unionMeta.clip.height)
      }
    } else {
      await loc.screenshot({ path: filePath })
      const box = await loc.boundingBox()
      pngSize = box ? { width: Math.round(box.width), height: Math.round(box.height) } : null
    }
    if (shot.teardown) await shot.teardown(page)
    evidence.push({
      file: shot.file,
      absolutePath: filePath,
      url,
      anchor: shot.anchor,
      stateSetup: shot.state,
      captureFraming,
      unionMeta,
      pngSize,
      metrics
    })
    artifactPaths.push(filePath)
  }

  const manifestPath = resolve(outDir, 'capture-manifest.json')
  let prev = {}
  try {
    prev = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch {
    /* fresh */
  }
  const mergedByFile = new Map((prev.screenshots || []).map((s) => [s.file, s]))
  for (const e of evidence) mergedByFile.set(e.file, e)
  const screenshots = SHOT_ORDER.filter((f) => mergedByFile.has(f)).map((f) => mergedByFile.get(f))
  const manifest = {
    ...prev,
    ...git,
    buildId,
    capturedAt: new Date().toISOString(),
    partialCapture: Boolean(only?.length),
    replacedFiles: evidence.map((e) => e.file),
    docsBase: BASE,
    viewportCss: VIEWPORT,
    devicePixelRatio: DPR,
    chromeHandling:
      'Hides VPNav/VPLocalNav/DocSearch only; scroll anchor; tooltip uses viewport union clip when teleported',
    screenshots,
    artifactPaths: [
      ...new Set([
        ...(prev.artifactPaths || []),
        ...artifactPaths,
        manifestPath,
        resolve(outDir, 'behavior-checks.json')
      ])
    ],
    behaviorChecks: behaviors
  }
  const behaviorPath = resolve(outDir, 'behavior-checks.json')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  await writeFile(behaviorPath, JSON.stringify(behaviors, null, 2))
  artifactPaths.push(manifestPath, behaviorPath)
  console.log(JSON.stringify({ ok: true, commitSha: git.commitSha, worktreeClean: git.worktreeClean, outDir, shotCount: evidence.length }, null, 2))
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})