#!/usr/bin/env node
/**
 * Dialog dismiss + focus from npm pack install (NOT docs site).
 * Env: PACK_TARBALL (required), PACK_DIALOG_EVIDENCE_OUT, EXPECT_TARBALL_SHA256, EXPECT_GIT_HEAD
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
  process.env.PACK_DIALOG_EVIDENCE_OUT ||
  join(repoRoot, '.consumer-pack-test', 'pack-dialog-browser-evidence.json')

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
    throw new Error(
      `tarball sha mismatch: expected ${process.env.EXPECT_TARBALL_SHA256}, got ${tarballSha256}`
    )
  }
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'))
  const gitHead = sh('git rev-parse HEAD', repoRoot)

  const dir = await mkdtemp(join(tmpdir(), 'portico-pack-dialog-'))
  const port = 5199
  let viteProc
  try {
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify(
        {
          name: 'pack-dialog-harness',
          private: true,
          type: 'module',
          dependencies: { vue: '3.4.38', 'portico-ui': `file:${tgzPath}` },
          devDependencies: { vite: '^7.1.12', '@vitejs/plugin-vue': '^6.0.1' }
        },
        null,
        2
      )
    )
    await writeFile(
      join(dir, 'index.html'),
      `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div id="app"></div><script type="module" src="/main.js"></script></body></html>`
    )
    await writeFile(
      join(dir, 'main.js'),
      `import { createApp, ref, h } from 'vue'
import PorticoUI, { PtDialog, PtButton } from 'portico-ui/dist/portico-ui.es.js'
import 'portico-ui/dist/style.css'

const visible = ref(false)
const app = createApp({
  setup() {
    return () => h('div', [
      h(PtButton, { type: 'primary', nativeType: 'button', class: 'open-dialog', onClick: () => (visible.value = true) }, () => 'Open dialog'),
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
              h(PtButton, { onClick: () => (visible.value = false) }, () => 'Cancel'),
              h(PtButton, { type: 'primary', nativeType: 'button', class: 'dlg-confirm', onClick: () => (visible.value = false) }, () => 'OK')
            ])
        }
      )
    ])
  }
})
app.use(PorticoUI)
app.mount('#app')
`
    )
    await writeFile(
      join(dir, 'vite.config.js'),
      `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  server: { port: ${port}, strictPort: true },
  resolve: { dedupe: ['vue'] }
})
`
    )
    sh('npm install', dir)
    const styleCss = readFileSync(join(dir, 'node_modules/portico-ui/dist/style.css'), 'utf8')
    const hasHiddenRule = /\.pt-dialog:not\(\.is-visible\)/.test(styleCss)
    if (!hasHiddenRule) throw new Error('packed style.css missing .pt-dialog:not(.is-visible) rule')

    viteProc = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', String(port)], {
      cwd: dir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    })
    const viteLog = []
    viteProc.stdout?.on('data', (d) => viteLog.push(String(d)))
    viteProc.stderr?.on('data', (d) => viteLog.push(String(d)))
    const base = `http://127.0.0.1:${port}`
    for (let i = 0; i < 40; i++) {
      try {
        const res = await fetch(base)
        if (res.ok) break
      } catch {
        /* */
      }
      await delay(250)
    }

    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const page = await browser.newPage()
    const consoleLog = []
    page.on('console', (msg) => consoleLog.push(msg.text()))
    page.on('pageerror', (err) => consoleLog.push(`pageerror: ${err.message}`))
    await page.goto(base, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('button.pt-button', { timeout: 60000 })

    const runDismiss = async (label, action) => {
      await page.getByText('Open dialog', { exact: true }).click()
      await page.waitForSelector('.pt-dialog.is-visible', { timeout: 5000 })
      await action()
      await page.waitForFunction(
        () => {
          const root = document.querySelector('.pt-dialog')
          if (!root) return true
          return !root.classList.contains('is-visible') && getComputedStyle(root).pointerEvents === 'none'
        },
        undefined,
        { timeout: 5000 }
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
        await page.locator('button.dlg-confirm').focus()
        await page.keyboard.press('Escape')
      })
    )
    paths.push(
      await runDismiss('overlay', async () => {
        const panel = await page.locator('.pt-dialog__panel').boundingBox()
        await page.mouse.click(panel.x - 8, panel.y + panel.height / 2)
      })
    )

    await browser.close()

    const ok = hasHiddenRule && paths.every((p) => p.focusReturnedToOpen)
    const report = {
      capturedAt: new Date().toISOString(),
      mode: 'npm-pack-installed-vite-playwright',
      notSourceTreeDocs: true,
      gitHead,
      packedVersion: pkg.version,
      packTarballPath: tgzPath,
      tarballSha256,
      installedFromPack: `file:${tgzPath}`,
      vuePeerUsed: '3.4.38',
      styleCssHasDialogHiddenRule: hasHiddenRule,
      dismissPaths: paths,
      browserConsole: consoleLog.slice(-40),
      viteLog: viteLog.slice(-20),
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
  if (err?.message?.includes('Timeout')) {
    console.error('Hint: check pack vite harness — button.pt-button did not mount')
  }
  process.exit(1)
})