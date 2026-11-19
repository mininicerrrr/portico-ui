#!/usr/bin/env node
/**
 * Pack-installed consumer runtime: Vue 3.4 ESM/CJS + PtTooltip/PtTable mount (no useId).
 * stdout: one JSON line { ok, vue, checks, error? }
 */
import { execSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const vueVer = process.argv[2] || '3.4.38'
const tgzPath = process.argv[3] ? resolve(process.argv[3]) : ''
if (!tgzPath) {
  console.log(JSON.stringify({ ok: false, error: 'usage: consumer-runtime-vue34.mjs <vueVer> <tgzPath>' }))
  process.exit(1)
}

function sh(cmd, cwd) {
  return execSync(cmd, { encoding: 'utf8', cwd, stdio: ['pipe', 'pipe', 'pipe'] })
}

function installDom() {
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true
  })
  const { window } = dom
  globalThis.window = window
  globalThis.document = window.document
  globalThis.HTMLElement = window.HTMLElement
  globalThis.Node = window.Node
  globalThis.KeyboardEvent = window.KeyboardEvent
  globalThis.Element = window.Element
  globalThis.CustomEvent = window.CustomEvent
  globalThis.SVGElement = window.SVGElement
  globalThis.getComputedStyle = window.getComputedStyle.bind(window)
  return dom
}

async function main() {
  const dir = await mkdtemp(join(tmpdir(), 'portico-runtime-34-'))
  try {
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({ name: 'runtime-34', private: true, type: 'module' }, null, 2)
    )
    sh(`npm install vue@${vueVer} jsdom@27 portico-ui@file:${tgzPath}`, dir)

    const esPath = join(dir, 'node_modules/portico-ui/dist/portico-ui.es.js')
    const esSrc = await readFile(esPath, 'utf8')
    if (/\buseId\b/.test(esSrc.split('\n')[0] ?? esSrc.slice(0, 500))) {
      throw new Error('portico-ui.es.js still imports useId from vue (Vue 3.5-only)')
    }

    const dom = installDom()
    const vueMod = await import(
      pathToFileURL(join(dir, 'node_modules/vue/dist/vue.runtime.esm-bundler.js')).href
    )
    const porticoMod = await import(pathToFileURL(esPath).href)

    const { createApp, h, defineComponent, nextTick } = vueMod
    const { PtTooltip, PtTable } = porticoMod
    if (!PtTooltip || !PtTable) throw new Error('PtTooltip or PtTable missing from pack install')

    const host = document.getElementById('app')
    const App = defineComponent({
      setup() {
        return () =>
          h('div', { class: 'fixture' }, [
            h(PtTooltip, { content: 'Tip A', triggers: ['focus'], showAfter: 0, hideAfter: 0 }, () =>
              h('button', { id: 'btn-a', type: 'button' }, 'A')
            ),
            h(PtTooltip, { content: 'Tip B', triggers: ['focus'], showAfter: 0, hideAfter: 0 }, () =>
              h('button', { id: 'btn-b', type: 'button' }, 'B')
            ),
            h(PtTable, {
              columns: [{ prop: 'n', label: 'Name', showOverflowTooltip: true }],
              data: [{ n: 'x'.repeat(80) }]
            })
          ])
      }
    })

    const app = createApp(App)
    app.mount(host)
    await nextTick()
    await new Promise((r) => setTimeout(r, 50))

    const panels = [...document.body.querySelectorAll('[id^="pt-tooltip-panel-"]')]
    const panelIds = panels.map((el) => el.id)
    if (panelIds.length < 2) throw new Error(`expected >=2 tooltip panels, got ${panelIds.length}`)
    if (new Set(panelIds).size !== panelIds.length) throw new Error('tooltip panel ids not unique')

    const btnA = document.getElementById('btn-a')
    btnA?.focus()
    btnA?.dispatchEvent(new window.Event('focusin', { bubbles: true }))
    await nextTick()
    await new Promise((r) => setTimeout(r, 80))

    const trigger = document.querySelector('.pt-tooltip')
    const describedBy = trigger?.getAttribute('aria-describedby')
    const panel = describedBy ? document.getElementById(describedBy) : null
    if (!describedBy || !panel) throw new Error('focus should set aria-describedby + tooltip panel')
    if (panel.getAttribute('role') !== 'tooltip') throw new Error('panel role=tooltip expected')
    if (!panel.textContent?.includes('Tip')) throw new Error('tooltip content not rendered')

    window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    if (trigger?.getAttribute('aria-describedby')) {
      throw new Error('Escape should clear aria-describedby')
    }

    const table = document.querySelector('.pt-table')
    if (!table) throw new Error('PtTable did not mount')

    const checks = {
      esBundleNoUseId: true,
      tooltipUniquePanelIds: panelIds,
      ariaDescribedByOnFocus: describedBy,
      escapeClearsDescribedBy: true,
      ptTableMounted: true,
      vue: vueVer
    }

    console.log(JSON.stringify({ ok: true, vue: vueVer, checks }))
    dom.window.close()
  } catch (err) {
    console.log(JSON.stringify({ ok: false, vue: vueVer, error: String(err?.message || err) }))
    process.exitCode = 1
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}

main()