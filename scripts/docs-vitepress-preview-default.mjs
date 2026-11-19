#!/usr/bin/env node
/**
 * Exercise DEFAULT `vitepress preview` with the configured base `/portico-ui/`.
 * Documents the known asset 404 limitation; does not claim parity with static-docs-server.
 */
import { spawn, execSync } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const port = Number(process.env.VP_PREVIEW_PORT || 4174)
const BASE = `http://127.0.0.1:${port}/portico-ui`

function freePort() {
  try {
    execSync(`lsof -ti:${port} | xargs -r kill -9`, { stdio: 'ignore' })
  } catch {
    /* ok */
  }
}

async function waitForServer() {
  const start = Date.now()
  while (Date.now() - start < 30000) {
    try {
      const res = await fetch(`${BASE}/guide/visual-v2.html`)
      if (res.ok) return
    } catch {
      /* retry */
    }
    await delay(400)
  }
  throw new Error('vitepress preview did not become ready')
}

async function main() {
  freePort()
  await delay(200)
  const proc = spawn('npx', ['vitepress', 'preview', 'docs', '--host', '127.0.0.1', '--port', String(port)], {
    stdio: 'ignore'
  })
  const report = {
    runner: 'vitepress preview (default)',
    base: '/portico-ui/',
    port,
    htmlOk: false,
    cssAssetOk: false,
    cssStatus: null,
    cssUrl: null,
    limitation:
      'With base=/portico-ui/, default preview often serves HTML but 404s hashed /portico-ui/assets/* — use static-docs-server for GH-Pages parity'
  }
  try {
    await waitForServer()
    const pageRes = await fetch(`${BASE}/guide/visual-v2.html`)
    report.htmlOk = pageRes.ok
    const html = await pageRes.text()
    const cssPath = html.match(/href="(\/portico-ui\/assets\/style\.[^"]+\.css)"/)?.[1]
    report.cssUrl = cssPath ? `http://127.0.0.1:${port}${cssPath}` : null
    if (report.cssUrl) {
      const cssRes = await fetch(report.cssUrl)
      report.cssStatus = cssRes.status
      report.cssAssetOk = cssRes.ok
    }
    report.defaultPreviewFullyUsable = report.htmlOk && report.cssAssetOk
    console.log(JSON.stringify(report, null, 2))
    process.exit(report.defaultPreviewFullyUsable ? 0 : 2)
  } finally {
    proc.kill('SIGTERM')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})