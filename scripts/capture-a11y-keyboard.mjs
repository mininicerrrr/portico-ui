#!/usr/bin/env node
/** Keyboard a11y evidence (built docs + static server). Requires docs:build first. */
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn, execSync } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const repoRoot = resolve(import.meta.dirname, '..')
const outDir = process.env.A11Y_EVIDENCE_DIR || '/opt/cursor/artifacts/a11y-keyboard'
const BASE = 'http://127.0.0.1:4173/portico-ui'

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
  const sortHeader = page.locator('#v2-table-sorted-target th.is-sortable').first()
  await sortHeader.focus()
  await page.screenshot({ path: resolve(outDir, 'keyboard-sort-header-focus.png') })
  await page.goto(`${BASE}/guide/visual-v2#v2-table-tooltip`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#v2-table-tooltip .pt-table__cell--overflow-focusable', { timeout: 15000 })
  const overflow = page.locator('#v2-table-tooltip .pt-table__cell--overflow-focusable').first()
  await overflow.focus()
  await delay(350)
  await page.screenshot({ path: resolve(outDir, 'keyboard-overflow-cell-focus-tooltip.png'), fullPage: false })
  const meta = await page.evaluate(() => {
    const cell = document.querySelector('#v2-table-tooltip .pt-table__cell--overflow-focusable')
    const panel = document.querySelector('[role="tooltip"]')
    return {
      cellTabIndex: cell?.getAttribute('tabindex'),
      describedBy: document.activeElement?.getAttribute?.('aria-describedby'),
      tooltipVisible: panel ? panel.getBoundingClientRect().width > 0 : false
    }
  })
  await browser.close()
  server.kill('SIGTERM')
  console.log(
    JSON.stringify(
      {
        ok: true,
        outDir,
        files: [
          resolve(outDir, 'keyboard-sort-header-focus.png'),
          resolve(outDir, 'keyboard-overflow-cell-focus-tooltip.png')
        ],
        steps: [
          'Focus sortable th via playwright .focus() on #v2-table-sorted-target',
          'Focus overflow cell on #v2-table-tooltip when .pt-table__cell--overflow-focusable present'
        ],
        meta
      },
      null,
      2
    )
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})