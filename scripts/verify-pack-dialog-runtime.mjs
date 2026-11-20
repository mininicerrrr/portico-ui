#!/usr/bin/env node
/**
 * Dialog dismiss paths from npm pack install (JSDOM runtime — not docs site).
 * Env: PACK_TARBALL, PACK_DIALOG_EVIDENCE_OUT, EXPECT_TARBALL_SHA256, EXPECT_GIT_HEAD
 */
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tgzPath = resolve(process.env.PACK_TARBALL || '')
const outPath =
  process.env.PACK_DIALOG_EVIDENCE_OUT ||
  join(repoRoot, '.consumer-pack-test', 'pack-dialog-runtime-evidence.json')

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function sh(cmd, cwd) {
  return execSync(cmd, { encoding: 'utf8', cwd, stdio: ['pipe', 'pipe', 'pipe'] }).trim()
}

function installDom() {
  const dom = new JSDOM('<!DOCTYPE html><html><body><motion id="app"></motion></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true
  })
  const { window } = dom
  globalThis.window = window
  globalThis.document = window.document
  globalThis.HTMLElement = window.HTMLElement
  globalThis.Element = window.Element
  globalThis.KeyboardEvent = window.KeyboardEvent
  globalThis.MouseEvent = window.MouseEvent
  globalThis.SVGElement = window.SVGElement
  globalThis.Node = window.Node
  globalThis.getComputedStyle = window.getComputedStyle.bind(window)
  return dom
}

async function main() {
  if (!tgzPath) throw new Error('PACK_TARBALL required')
  const tarballSha256 = sha256File(tgzPath)
  if (process.env.EXPECT_TARBALL_SHA256 && process.env.EXPECT_TARBALL_SHA256 !== tarballSha256) {
    throw new Error(`tarball sha mismatch expected ${process.env.EXPECT_TARBALL_SHA256}`)
  }
  const gitHead = sh('git rev-parse HEAD', repoRoot)
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'))

  const dir = await mkdtemp(join(tmpdir(), 'pack-dialog-runtime-'))
  try {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ name: 'dlg', private: true, type: 'module' }))
    sh(`npm install vue@3.4.38 jsdom@27 portico-ui@file:${tgzPath}`, dir)

    const styleCss = readFileSync(join(dir, 'node_modules/portico-ui/dist/style.css'), 'utf8')
    if (!/\.pt-dialog:not\(\.is-visible\)/.test(styleCss)) {
      throw new Error('packed style.css missing dialog hidden rule')
    }
    const esPath = join(dir, 'node_modules/portico-ui/dist/portico-ui.es.js')
    const dom = installDom()
    const styleEl = document.createElement('style')
    styleEl.textContent = styleCss
    document.head.appendChild(styleEl)
    document.body.innerHTML = '<motion id="app"></motion><button type="button" class="open-dialog">Open</button>'
    const trigger = document.querySelector('.open-dialog')

    const vueMod = await import(pathToFileURL(join(dir, 'node_modules/vue/dist/vue.runtime.esm-bundler.js')).href)
    const { PtDialog, PtButton } = await import(pathToFileURL(esPath).href)
    const { createApp, ref, h, nextTick } = vueMod

    const visible = ref(false)
    const app = createApp({
      setup() {
        return () =>
          h('motion', [
            h(
              PtDialog,
              {
                modelValue: visible.value,
                'onUpdate:modelValue': (v) => (visible.value = v),
                title: 'Confirm'
              },
              {
                default: () => 'Body',
                footer: () =>
                  h('div', [
                    h(PtButton, { class: 'dlg-ok', onClick: () => (visible.value = false) }, () => 'OK')
                  ])
              }
            )
          ])
      }
    })
    app.mount('#app')

    const waitClosed = async () => {
      for (let i = 0; i < 8; i++) await nextTick()
      const root = document.querySelector('.pt-dialog')
      if (!root) return
      if (root.classList.contains('is-visible')) throw new Error('dialog still visible')
      const style = getComputedStyle(root)
      if (style.visibility !== 'hidden' || style.pointerEvents !== 'none') {
        throw new Error(`dialog still active (visibility=${style.visibility}, pointerEvents=${style.pointerEvents})`)
      }
    }

    const paths = []

    const open = async () => {
      trigger.focus()
      visible.value = true
      await nextTick()
      await nextTick()
      if (!document.querySelector('.pt-dialog.is-visible')) throw new Error('dialog did not open')
    }

    await open()
    const closeBtn = document.querySelector('.pt-dialog__close')
    closeBtn.click()
    await waitClosed()
    paths.push({ label: 'header-close', focusReturnedToOpen: document.activeElement === trigger })

    await open()
    const okBtn = document.querySelector('.dlg-ok')
    okBtn.focus()
    okBtn.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await waitClosed()
    paths.push({ label: 'escape', focusReturnedToOpen: document.activeElement === trigger })

    await open()
    document.querySelector('.pt-dialog__overlay').dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
    await waitClosed()
    paths.push({ label: 'overlay', focusReturnedToOpen: document.activeElement === trigger })

    const ok = paths.every((p) => p.focusReturnedToOpen)
    const report = {
      capturedAt: new Date().toISOString(),
      mode: 'npm-pack-installed-jsdom-runtime',
      notSourceTreeDocs: true,
      notPlaywrightBrowser: true,
      gitHead,
      packedVersion: pkg.version,
      tarballSha256,
      packTarballPath: tgzPath,
      vuePeerUsed: '3.4.38',
      styleCssHasDialogHiddenRule: true,
      dismissPaths: paths,
      ok
    }
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, JSON.stringify(report, null, 2))
    console.log(JSON.stringify(report, null, 2))
    dom.window.close()
    if (!ok) process.exit(1)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})