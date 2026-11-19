#!/usr/bin/env node
/** Keyboard a11y evidence — real Tab focus for :focus-visible (not programmatic .focus()). */
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn, execSync } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const repoRoot = resolve(import.meta.dirname, '..')
const outDir = process.env.A11Y_EVIDENCE_DIR || '/opt/cursor/artifacts/v2-screenshots/a11y-keyboard'
const BASE = 'http://127.0.0.1:4173/portico-ui'
const TOOLTIP_TEXT_SNIPPET = '品牌资产协作规范'

function gitHead() {
  return execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim()
}

const CHROME_HIDE_CSS = `
  .VPNav, .VPNavBar, .VPLocalNav, .VPDocAside, .DocSearch { display: none !important; }
  .VPContent, .VPDoc, main { padding-top: 0 !important; }
`

async function hideChrome(page) {
  await page.evaluate((css) => {
    const id = 'a11y-chrome-hide'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id
      s.textContent = css
      document.head.appendChild(s)
    }
  }, CHROME_HIDE_CSS)
}

async function focusTabSentinel(page, hostSelector) {
  await page.evaluate((sel) => {
    document.querySelector('#__a11y_tab_start')?.remove()
    const host = document.querySelector(sel)
    if (!host) return
    const start = document.createElement('button')
    start.type = 'button'
    start.id = '__a11y_tab_start'
    start.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;'
    host.prepend(start)
    start.focus()
  }, hostSelector)
}

async function tabUntil(page, predicate, maxTabs = 24) {
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab')
    const ok = await page.evaluate(predicate)
    if (ok) return true
  }
  return false
}

async function unionClip(page, rootSel, extraSel) {
  return page.evaluate(
    ({ rootSel, extraSel }) => {
      const root = document.querySelector(rootSel)
      const extra = extraSel ? document.querySelector(extraSel) : null
      if (!root) return null
      const boxes = [root.getBoundingClientRect()]
      if (extra) boxes.push(extra.getBoundingClientRect())
      const pad = 12
      const x = Math.min(...boxes.map((b) => b.left)) - pad
      const y = Math.min(...boxes.map((b) => b.top)) - pad
      const right = Math.max(...boxes.map((b) => b.right)) + pad
      const bottom = Math.max(...boxes.map((b) => b.bottom)) + pad
      return {
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: right - Math.max(0, x),
        height: bottom - Math.max(0, y)
      }
    },
    { rootSel, extraSel }
  )
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
  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

  await page.goto(`${BASE}/guide/visual-v2#v2-table-sorted`, { waitUntil: 'networkidle' })
  await hideChrome(page)
  await focusTabSentinel(page, '#v2-table-sorted')
  const sortedOk = await tabUntil(page, () => {
    const el = document.activeElement
    return (
      el?.tagName === 'TH' &&
      Boolean(el.closest('#v2-table-sorted-target')) &&
      el.classList.contains('is-sortable') &&
      el.matches(':focus-visible')
    )
  })
  if (!sortedOk) throw new Error('Could not Tab to sortable header with :focus-visible')
  const sortTh = await page.evaluate(() => {
    const el = document.activeElement
    if (!el || el.tagName !== 'TH') return null
    const r = el.getBoundingClientRect()
    return { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height + 16 }
  })
  await page.screenshot({ path: resolve(outDir, 'keyboard-sort-header-focus.png'), clip: sortTh ?? undefined })

  await page.goto(`${BASE}/guide/visual-v2#v2-table-tooltip`, { waitUntil: 'networkidle' })
  await hideChrome(page)
  await page.waitForSelector('#v2-table-tooltip .pt-table__cell--overflow-focusable', { timeout: 15000 })
  await page.evaluate(() => {
    document.querySelector('#v2-table-tooltip')?.scrollIntoView({ block: 'center', inline: 'nearest' })
  })
  await delay(200)
  await focusTabSentinel(page, '#v2-table-tooltip')
  const cellOk = await tabUntil(page, () => {
    const el = document.activeElement
    return (
      el?.classList?.contains('pt-table__cell--overflow-focusable') &&
      Boolean(el.closest('#v2-table-tooltip')) &&
      el.matches(':focus-visible')
    )
  })
  if (!cellOk) throw new Error('Could not Tab to #v2-table-tooltip overflow cell with :focus-visible')
  await page.waitForFunction(
    (snippet) => {
      const cell = document.activeElement
      const wrap = cell?.closest?.('.pt-tooltip')
      const id = wrap?.getAttribute?.('aria-describedby')
      if (!id) return false
      const panel = document.getElementById(id)
      const r = panel?.getBoundingClientRect()
      return Boolean(
        r &&
          r.width > 2 &&
          r.height > 2 &&
          panel.textContent?.includes(snippet) &&
          getComputedStyle(panel).visibility !== 'hidden' &&
          getComputedStyle(panel).opacity !== '0'
      )
    },
  TOOLTIP_TEXT_SNIPPET,
    { timeout: 4000 }
  )
  await delay(120)
  const overflowEvidence = await page.evaluate((snippet) => {
    const cell = document.activeElement
    const demo = document.querySelector('#v2-table-tooltip')
    if (!cell?.closest('#v2-table-tooltip') || !demo) return null
    const row = cell.closest('tr')
    const tipId = cell.closest('.pt-tooltip')?.getAttribute('aria-describedby')
    const tip = tipId ? document.getElementById(tipId) : null
    if (!tip?.textContent?.includes(snippet)) return null
    const tipR = tip.getBoundingClientRect()
    const boxes = [demo.getBoundingClientRect()]
    if (row) boxes.push(row.getBoundingClientRect())
    boxes.push(tipR)
    const td = cell.closest('td')
    if (td) boxes.push(td.getBoundingClientRect())
    const clip = (() => {
      const pad = 24
      const left = Math.min(...boxes.map((b) => b.left)) - pad
      const top = Math.min(...boxes.map((b) => b.top)) - pad
      const right = Math.max(...boxes.map((b) => b.right)) + pad
      const bottom = Math.max(...boxes.map((b) => b.bottom)) + pad
      return {
        x: Math.max(0, left),
        y: Math.max(0, top),
        width: Math.max(1, right - Math.max(0, left)),
        height: Math.max(1, bottom - Math.max(0, top))
      }
    })()
    const inside =
      tipR.left >= clip.x - 2 &&
      tipR.top >= clip.y - 2 &&
      tipR.right <= clip.x + clip.width + 2 &&
      tipR.bottom <= clip.y + clip.height + 2
    return {
      clip,
      panel: {
        id: tipId,
        text: tip.textContent?.trim(),
        bounds: { x: tipR.x, y: tipR.y, width: tipR.width, height: tipR.height }
      },
      focusTdOutline: td
        ? {
            width: getComputedStyle(td).outlineWidth,
            color: getComputedStyle(td).outlineColor
          }
        : null,
      panelInsideClip: inside
    }
  }, TOOLTIP_TEXT_SNIPPET)
  if (!overflowEvidence?.clip) throw new Error('Could not compute overflow union clip')
  if (!overflowEvidence.panelInsideClip) {
    throw new Error('Tooltip panel bounds outside screenshot clip — would crop teleported popup')
  }
  const overflowPath = resolve(outDir, 'keyboard-overflow-cell-focus-tooltip.png')
  await page.screenshot({ path: overflowPath, clip: overflowEvidence.clip })

  const meta = await page.evaluate(() => {
    const cell = document.activeElement
    const td = cell?.closest?.('td')
    const tipId = cell?.closest?.('.pt-tooltip')?.getAttribute?.('aria-describedby')
    const panel = tipId ? document.getElementById(tipId) : document.querySelector('[role="tooltip"]')
    const cs = td ? getComputedStyle(td) : null
    return {
      activeIsOverflowCell: cell?.classList?.contains('pt-table__cell--overflow-focusable') ?? false,
      focusVisible: cell?.matches?.(':focus-visible') ?? false,
      outlineWidth: cs?.outlineWidth,
      outlineColor: cs?.outlineColor,
      describedBy: tipId,
      tooltipVisible: panel ? panel.getBoundingClientRect().width > 2 : false
    }
  })

  const evidencePath = resolve(outDir, 'a11y-keyboard-evidence.json')
  const report = {
    ok: true,
    capturedAt: new Date().toISOString(),
    implementationSourceCommitSha: gitHead(),
    captureScript: 'scripts/capture-a11y-keyboard.mjs',
    outDir,
    files: [resolve(outDir, 'keyboard-sort-header-focus.png'), overflowPath],
    steps: [
      'Tab from sentinel through tab order until #v2-table-sorted-target th.is-sortable matches :focus-visible',
      'Scroll #v2-table-tooltip once, then Tab to overflow cell :focus-visible; wait focus tooltip with full text; viewport union clip (row ∪ panel ∪ demo) without demo-box clamp'
    ],
    overflowCapture: overflowEvidence,
    meta,
    assertions: {
      tooltipTextIncludes: TOOLTIP_TEXT_SNIPPET,
      panelInsideClip: overflowEvidence.panelInsideClip,
      focusVisible: meta.focusVisible,
      tooltipVisible: meta.tooltipVisible
    }
  }
  if (!meta.tooltipVisible || !overflowEvidence.panelInsideClip) {
    throw new Error('Post-capture assertion failed: tooltip not visible in DOM for evidence')
  }

  await browser.close()
  server.kill('SIGTERM')
  await writeFile(evidencePath, JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})