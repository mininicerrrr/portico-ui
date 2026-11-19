#!/usr/bin/env node
/**
 * Static file server for docs/.vitepress/dist with GitHub-Pages-style base `/portico-ui/`.
 * Workaround: `vitepress preview` does not map hashed assets under `base` correctly (404).
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(repoRoot, 'docs/.vitepress/dist')
const BASE = '/portico-ui'
const port = Number(process.env.DOCS_STATIC_PORT || 4173)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png'
}

function toDistRel(urlPath) {
  let rel = urlPath.startsWith(BASE) ? urlPath.slice(BASE.length) : urlPath
  if (rel === '' || rel === '/') return 'index.html'
  return rel.replace(/^\//, '')
}

function resolveFile(urlPath) {
  const rel = toDistRel(urlPath)
  if (!path.extname(rel)) {
    const clean = rel.endsWith('/') ? rel.slice(0, -1) : rel
    const htmlCandidate = path.join(distDir, `${clean}.html`)
    if (fs.existsSync(htmlCandidate)) return htmlCandidate
    return path.join(distDir, 'index.html')
  }
  return path.join(distDir, rel)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://127.0.0.1:${port}`)
  if (!url.pathname.startsWith(BASE)) {
    res.writeHead(302, { Location: `${BASE}/` })
    res.end()
    return
  }
  const file = resolveFile(url.pathname)
  if (!file.startsWith(distDir) || !fs.existsSync(file)) {
    res.writeHead(404)
    res.end('Not found')
    return
  }
  const ext = path.extname(file)
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`static docs at http://127.0.0.1:${port}${BASE}/`)
})