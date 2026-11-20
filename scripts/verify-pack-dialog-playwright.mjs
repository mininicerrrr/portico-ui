#!/usr/bin/env node
/**
 * Real Chromium Playwright: Dialog dismiss from npm pack install (not docs site).
 * Env: PACK_TARBALL, PACK_DIALOG_PLAYWRIGHT_OUT, EXPECT_*, PACK_DIST_STYLE_SHA256
 */
import { execSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tgzPath = resolve(process.env.PACK_TARBALL || '')
const outPath =
  process.env.PACK_DIALOG_PLAYWRIGHT_OUT ||
  join(repoRoot, '.consumer-pack-test', 'pack-dialog-playwright-evidence.json')

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function sh(cmd, cwd) {
  return execSync(cmd, { encoding: 'utf8', cwd, stdio: ['pipe', 'pipe', 'pipe'] }).trim()
}

async function main() {
  if (!tgzPath) throw new Error('PACK_TARBALL required')
  const tarballSha256 = sha256File(tgzPath)
  if (process.env.EXPECT_TARBALL_SHA256 && process.env.EXPECT_TARBALL_SHA256 !== tarballSha256) {
    throw new Error(`tarball sha mismatch`)
  }
  const gitHead = sh('git rev-parse HEAD', repoRoot)
  const pkgVer = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')).version
  const dir = await mkdtemp(join(tmpdir(), 'pack-dialog-pw-'))
  const port = 5299
  let viteProc
  const browserErrors = []

  try {
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify(
        {
          name: 'pack-dialog-playwright',
          private: true,
          type: 'module',
          dependencies: { vue: '3.4.38', 'portico-ui': `file:${tgzPath}` },
          devDependencies: { vite: '7.1.12', '@vitejs/plugin-vue': '6.0.1' }
        },
        null,
        2
      )
    )
    await writeFile(
      join(dir, 'index.html'),
      `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>pack-dialog</title></head>
<body><div id="app"></div><script type="module" src="/main.js"></script></body></html>`
    )
    await writeFile(
      join(dir, 'main.js'),
      `import { createApp, ref, h } from 'vue'
import { PtDialog, PtButton } from 'portico-ui'
import 'portico-ui/style.css'

const visible = ref(false)
createApp({
  setup() {
    return () =>
      h('div', [
        h(
          PtButton,
          { type: 'primary', class: 'open-dialog', onClick: () => (visible.value = true) },
          () => 'Open dialog'
        ),
        h(
          PtDialog,
          {
            modelValue: visible.value,
            'onUpdate:modelValue': (v) => (visible.value = v),
            title: 'Confirm'
          },
          {
            default: () => h('p', 'Body'),
            footer: () =>
              h('div', [
                h(PtButton, { class: 'dlg-ok', onClick: () => (visible.value = false) }, () => 'OK')
              ])
          }
        )
      ])
  }
}).mount('#app')
`
    )
    await writeFile(
      join(dir, 'vite.config.js'),
      `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  server: { port: ${port}, strictPort: true, host: '127.0.0.1' },
  optimizeDeps: { include: ['portico-ui', 'vue'] }
})
`
    )
    sh('npm install', dir)

    const packRoot = join(dir, 'node_modules/portico-ui')
    const packedVersion = JSON.parse(readFileSync(join(packRoot, 'package.json'), 'utf8')).version
    const distStyleSha256 = sha256File(join(packRoot, 'dist/style.css'))
    const distEsSha256 = sha256File(join(packRoot, 'dist/portico-ui.es.js'))
    if (process.env.PACK_DIST_STYLE_SHA256 && process.env.PACK_DIST_STYLE_SHA256 !== distStyleSha256) {
      throw new Error('packed dist/style.css sha mismatch vs build tree')
    }
    if (!/\.pt-dialog:not\(\.is-visible\)/.test(readFileSync(join(packRoot, 'dist/style.css'), 'utf8'))) {
      throw new Error('packed style missing dialog hidden rule')
    }

    viteProc = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', String(port)], {
      cwd: dir,
      stdio: 'ignore',
      shell: true
    })
    const base = `http://127.0.0.1:${port}`
    let ready = false
    for (let i = 0; i < 60; i++) {
      try {
        const res = await fetch(base)
        if (res.ok) {
          ready = true
          break
        }
      } catch {
        /* */
      }
      await delay(300)
    }
    if (!ready) throw new Error('vite dev server did not become ready')

    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const page = await browser.newPage()
    page.on('pageerror', (e) => browserErrors.push(`pageerror: ${e.message}`))
    await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForSelector('button.open-dialog', { timeout: 30000 })

    const runDismiss = async (label, action) => {
      await page.locator('button.open-dialog').click()
      await page.waitForSelector('.pt-dialog.is-visible', { timeout: 10000 })
      await action()
      await page.waitForFunction(
        () => {
          const root = document.querySelector('.pt-dialog')
          if (!root) return true
          return !root.classList.contains('is-visible') && getComputedStyle(root).pointerEvents === 'none'
        },
        undefined,
        { timeout: 10000 }
      )
      const focusOk = await page.evaluate(() => {
        const open = document.querySelector('button.open-dialog')
        return Boolean(open && document.activeElement === open)
      })
      return { label, focusReturnedToOpen: focusOk }
    }

    const paths = []
    paths.push(
      await runDismiss('header-close', async () => {
        await page.locator('.pt-dialog__close').click()
      })
    )
    paths.push(
      await runDismiss('escape', async () => {
        await page.locator('button.dlg-ok').focus()
        await page.keyboard.press('Escape')
      })
    )
    paths.push(
      await runDismiss('overlay', async () => {
        const panel = await page.locator('.pt-dialog__panel').boundingBox()
        if (!panel) throw new Error('panel box missing')
        await page.mouse.click(panel.x - 8, panel.y + panel.height / 2)
      })
    )

    const browserName = await browser.version()
    await browser.close()

    const ok = browserErrors.length === 0 && paths.every((p) => p.focusReturnedToOpen)
    const report = {
      capturedAt: new Date().toISOString(),
      mode: 'npm-pack-installed-vite-playwright-chromium',
      notSourceTreeDocs: true,
      notJsdom: true,
      browser: { engine: 'chromium', version: browserName },
      gitHead,
      packedVersion,
      packTarballPath: tgzPath,
      tarballSha256,
      packDist: {
        styleCssSha256: distStyleSha256,
        esBundleSha256: distEsSha256
      },
      vuePeerUsed: '3.4.38',
      dismissPaths: paths,
      browserErrors,
      ok
    }
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, JSON.stringify(report, null, 2))
    console.log(JSON.stringify(report, null, 2))
    if (!ok) process.exit(1)
  } finally {
    viteProc?.kill('SIGTERM')
    await rm(dir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})