#!/usr/bin/env node
/**
 * Pack consumer runtime evidence (Vue 3.4.38): tarball dist assets + harness.
 * Primary: real Tab → table overflow cell + full tooltip + focus ring in one clip.
 */
import { createReadStream, existsSync } from 'node:fs'
import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve, join, extname } from 'node:path'
import { execSync } from 'node:child_process'
import { chromium } from 'playwright'
import { setTimeout as delay } from 'node:timers/promises'

const repoRoot = resolve(import.meta.dirname, '..')
const outDir = process.env.TOOLTIP_RUNTIME_EVIDENCE_DIR || '/opt/cursor/artifacts/v2-screenshots/tooltip-runtime-vue34'
const packDest = join(repoRoot, '.consumer-pack-test')
const packAssets = join(packDest, 'pack-assets')
const TOOLTIP_SNIPPET = '品牌资产协作规范'

const VUE_34_CDN =
  'https://cdn.jsdelivr.net/npm/vue@3.4.38/dist/vue.runtime.esm-browser.prod.js'

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

async function preparePackAssets() {
  if (process.env.PACK_SKIP_BUILD !== '1') {
    execSync('npm run build', { cwd: repoRoot, stdio: 'inherit' })
  }
  execSync(`mkdir -p ${packDest}`, { shell: true })
  const packOut = execSync(`npm pack --pack-destination ${packDest}`, { cwd: repoRoot, encoding: 'utf8' }).trim()
  const tgzName = packOut.split('\n').pop()
  const tgzPath = join(packDest, tgzName)
  const tarballSha = execSync(`sha256sum ${JSON.stringify(tgzPath)}`, { encoding: 'utf8' }).trim().split(/\s+/)[0]
  const extractDir = join(packDest, '_tgz-extract')
  await rm(packAssets, { recursive: true, force: true }).catch(() => {})
  await rm(extractDir, { recursive: true, force: true }).catch(() => {})
  await mkdir(extractDir, { recursive: true })
  execSync(`tar -xzf ${JSON.stringify(tgzPath)} -C ${JSON.stringify(extractDir)}`, { stdio: 'inherit' })
  await cp(join(extractDir, 'package/dist'), packAssets, { recursive: true })
  return { tgzPath, tgzName, tarballSha }
}

function startStatic(root) {
  return new Promise((resolveServer) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url || '/', 'http://localhost')
      let rel = url.pathname
      if (rel.startsWith('/pack-assets/')) {
        const file = join(packAssets, rel.replace('/pack-assets/', ''))
        if (!file.startsWith(packAssets) || !existsSync(file)) {
          res.statusCode = 404
          res.end('not found')
          return
        }
        res.setHeader('Content-Type', contentType(file))
        createReadStream(file).pipe(res)
        return
      }
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

async function tabUntil(page, predicate, maxTabs = 32) {
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab')
    const ok = await page.evaluate(predicate)
    if (ok) return true
  }
  return false
}

async function captureTableOverflow(page, baseUrl, shotPath) {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(`${baseUrl}/scripts/fixtures/pack-table-overflow-harness.html`, { waitUntil: 'networkidle' })
  await page.waitForFunction(
    () =>
      Boolean(
        document.querySelector('#ev-table-overflow .pt-table__cell--overflow-focusable') ||
          (() => {
            const cell = document.querySelector('#ev-table-overflow .pt-table__cell')
            return cell && cell.scrollWidth > cell.clientWidth + 1
          })()
      ),
    { timeout: 25000 }
  )
  await page.waitForSelector('#ev-table-overflow .pt-table__cell--overflow-focusable', { timeout: 5000 })
  await page.evaluate(() => {
    document.querySelector('#ev-table-overflow')?.scrollIntoView({ block: 'center', inline: 'nearest' })
  })
  await delay(200)
  await page.focus('#__a11y_tab_start')
  const cellOk = await tabUntil(page, () => {
    const el = document.activeElement
    return (
      el?.classList?.contains('pt-table__cell--overflow-focusable') &&
      Boolean(el.closest('#ev-table-overflow')) &&
      el.matches(':focus-visible')
    )
  })
  if (!cellOk) throw new Error('Could not Tab to overflow table cell with :focus-visible')

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
          r.width > 4 &&
          r.height > 4 &&
          panel.textContent?.includes(snippet) &&
          getComputedStyle(panel).visibility !== 'hidden'
      )
    },
    TOOLTIP_SNIPPET,
    { timeout: 5000 }
  )
  await delay(150)

  const openState = await page.evaluate((snippet) => {
    const cell = document.activeElement
    const demo = document.querySelector('#ev-table-overflow')
    const tipId = cell?.closest('.pt-tooltip')?.getAttribute('aria-describedby')
    const tip = tipId ? document.getElementById(tipId) : null
    const td = cell?.closest('td')
    if (!tip?.textContent?.includes(snippet)) return null
    const tipR = tip.getBoundingClientRect()
    const boxes = [demo.getBoundingClientRect(), tipR]
    if (td) boxes.push(td.getBoundingClientRect())
    const row = cell?.closest('tr')
    if (row) boxes.push(row.getBoundingClientRect())
    const pad = 28
    const left = Math.min(...boxes.map((b) => b.left)) - pad
    const top = Math.min(...boxes.map((b) => b.top)) - pad
    const right = Math.max(...boxes.map((b) => b.right)) + pad
    const bottom = Math.max(...boxes.map((b) => b.bottom)) + pad
    const clip = {
      x: Math.max(0, left),
      y: Math.max(0, top),
      width: Math.max(1, right - Math.max(0, left)),
      height: Math.max(1, bottom - Math.max(0, top))
    }
    const inside =
      tipR.left >= clip.x - 1 &&
      tipR.top >= clip.y - 1 &&
      tipR.right <= clip.x + clip.width + 1 &&
      tipR.bottom <= clip.y + clip.height + 1
    const panels = [...document.querySelectorAll('[id^="pt-tooltip-panel-"]')].map((el) => el.id)
    return {
      clip,
      panelInsideClip: inside,
      panelIds: panels,
      uniquePanelIds: new Set(panels).size === panels.length,
      describedBy: tipId,
      panelRole: tip.getAttribute('role'),
      panelTextLen: tip.textContent?.trim().length ?? 0,
      panelTextIncludesSnippet: tip.textContent?.includes(snippet),
      focusVisible: cell.matches(':focus-visible'),
      focusTdOutline: td
        ? { width: getComputedStyle(td).outlineWidth, color: getComputedStyle(td).outlineColor }
        : null
    }
  }, TOOLTIP_SNIPPET)

  if (!openState?.panelInsideClip) {
    throw new Error(`Tooltip panel not fully inside screenshot clip: ${JSON.stringify(openState)}`)
  }
  if (!openState.panelTextIncludesSnippet) throw new Error('Tooltip text snippet missing')
  if (openState.panelRole !== 'tooltip') throw new Error('panel role must be tooltip')

  await page.screenshot({ path: shotPath, clip: openState.clip })

  await page.keyboard.press('Escape')
  await delay(120)
  const afterEscape = await page.evaluate(() => {
    const cell = document.querySelector('.pt-table__cell--overflow-focusable')
    const wrap = cell?.closest('.pt-tooltip')
    return { describedBy: wrap?.getAttribute('aria-describedby') ?? null }
  })
  if (afterEscape.describedBy) throw new Error('Escape should clear aria-describedby on table overflow tooltip')

  await page.keyboard.press('Tab')
  await delay(80)
  const afterBlur = await page.evaluate(() => {
    const wrap = document.querySelector('#ev-table-overflow .pt-tooltip')
    return {
      describedBy: wrap?.getAttribute('aria-describedby') ?? null,
      activeIsCell: document.activeElement?.classList?.contains('pt-table__cell--overflow-focusable')
    }
  })

  return {
    ...openState,
    escapeClearsDescribedBy: !afterEscape.describedBy,
    blurOrTabAwayClearsDescribedBy: !afterBlur.describedBy && !afterBlur.activeIsCell,
    screenshot: shotPath,
    interaction: 'keyboard-Tab-focus; Escape; Tab-blur'
  }
}

async function captureDualTooltip(page, baseUrl, shotPath) {
  await page.setViewportSize({ width: 1000, height: 700 })
  await page.goto(`${baseUrl}/scripts/fixtures/pack-dual-tooltip-harness.html`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#ev-tip-a')
  await page.focus('#ev-tip-a')
  await page.evaluate(() => {
    document.getElementById('ev-tip-a')?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
  })
  await delay(350)
  const state = await page.evaluate(() => {
    const panels = [...document.querySelectorAll('[id^="pt-tooltip-panel-"]')].map((el) => el.id)
    const trigger = document.querySelector('.pt-tooltip')
    const described = trigger?.getAttribute('aria-describedby')
    const panel = described ? document.getElementById(described) : null
    const tipR = panel?.getBoundingClientRect()
    const btn = document.getElementById('ev-tip-a')?.getBoundingClientRect()
    if (!panel || !btn || !tipR) return null
    const pad = 32
    const clip = {
      x: Math.max(0, Math.min(btn.left, tipR.left) - pad),
      y: Math.max(0, Math.min(btn.top, tipR.top) - pad),
      width:
        Math.max(btn.right, tipR.right) + pad - Math.max(0, Math.min(btn.left, tipR.left) - pad),
      height:
        Math.max(btn.bottom, tipR.bottom) + pad - Math.max(0, Math.min(btn.top, tipR.top) - pad)
    }
    const inside =
      tipR.left >= clip.x &&
      tipR.top >= clip.y &&
      tipR.right <= clip.x + clip.width &&
      tipR.bottom <= clip.y + clip.height
    return {
      clip,
      panelInsideClip: inside,
      panelIds: panels,
      uniquePanelIds: new Set(panels).size === panels.length,
      describedBy: described,
      panelRole: panel.getAttribute('role')
    }
  })
  if (!state?.panelInsideClip) throw new Error('Dual tooltip panel clipped')
  await page.screenshot({ path: shotPath, clip: state.clip })
  return { ...state, screenshot: shotPath, interaction: 'programmatic-focusin (matrix smoke)' }
}

async function main() {
  const evidenceCaptureGitSha = gitHead()
  const implementationGitSha = process.env.PORTICO_IMPLEMENTATION_SHA?.trim() || evidenceCaptureGitSha
  const { tgzPath, tgzName, tarballSha } = await preparePackAssets()
  const server = await startStatic(repoRoot)
  const { port } = server.address()
  const baseUrl = `http://127.0.0.1:${port}`

  await mkdir(outDir, { recursive: true })
  const tableShot = join(outDir, 'pack-vue34-table-overflow-tab-focus-tooltip.png')
  const dualShot = join(outDir, 'pack-vue34-dual-tooltip-focus.png')

  const browser = await chromium.launch()
  const page = await browser.newPage()

  const tableScenario = await captureTableOverflow(page, baseUrl, tableShot)
  const dualScenario = await captureDualTooltip(page, baseUrl, dualShot)

  const evidence = {
    capturedAt: new Date().toISOString(),
    evidenceCaptureGitSha,
    implementationGitSha,
    note:
      'implementationGitSha = library candidate (set PORTICO_IMPLEMENTATION_SHA when capture-only commits differ); evidenceCaptureGitSha = this script revision',
    tarball: { path: tgzPath, name: tgzName, sha256: tarballSha },
    vueRuntime: VUE_34_CDN,
    porticoBundle: `${baseUrl}/pack-assets/portico-ui.es.js`,
    porticoStylesheet: `${baseUrl}/pack-assets/style.css`,
    packSource: 'npm pack extracted to .consumer-pack-test/pack-assets (same bytes as consumer tarball dist/)',
    scenarios: {
      tableOverflowTabFocusTooltip: tableScenario,
      dualTooltipFocus: dualScenario
    },
    screenshots: [tableShot, dualShot]
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