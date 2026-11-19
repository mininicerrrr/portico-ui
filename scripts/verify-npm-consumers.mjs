#!/usr/bin/env node
/**
 * Install the packed tarball in clean fixtures: CJS require, ESM import, strict vue-tsc (no skipLibCheck).
 */
import { execSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packDest = join(repoRoot, '.consumer-pack-test')
await mkdir(packDest, { recursive: true })
const tgzName = execSync(`npm pack --pack-destination ${packDest}`, {
  cwd: repoRoot,
  encoding: 'utf8'
})
  .trim()
  .split('\n')
  .pop()
const tgzPath = join(packDest, tgzName)

async function runFixture(name, fn) {
  const dir = await mkdtemp(join(tmpdir(), `portico-consumer-${name}-`))
  try {
    await fn(dir)
    console.log(`[ok] consumer ${name}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`)
}

async function main() {
  await runFixture('cjs', async (dir) => {
    await writeJson(join(dir, 'package.json'), {
      name: 'cjs-fixture',
      private: true,
      type: 'commonjs',
      dependencies: { vue: '^3.4.0', 'portico-ui': `file:${tgzPath}` }
    })
    await writeFile(
      join(dir, 'index.cjs'),
      `const { createRequire } = require('module');
const vue = require('vue');
const portico = require('portico-ui');
const viaCreateRequire = createRequire(__filename)('portico-ui');
for (const [label, mod] of [
  ['require', portico],
  ['createRequire', viaCreateRequire]
]) {
  if (typeof mod !== 'object' || mod === null) throw new Error(label + ': empty export');
  const keys = Object.keys(mod);
  if (keys.length < 3) throw new Error(label + ': export looks empty keys=' + keys.join(','));
  if (typeof mod.PtButton !== 'object' && typeof mod.PtButton !== 'function')
    throw new Error(label + ': PtButton missing');
  if (typeof mod.default?.install !== 'function')
    throw new Error(label + ': default.install missing');
}
if (typeof vue.defineComponent !== 'function') throw new Error('vue.defineComponent missing');
console.log('cjs', portico.PtButton.name, 'node', process.version);
`
    )
    execSync('npm install', { cwd: dir, stdio: 'inherit' })
    execSync('node index.cjs', { cwd: dir, stdio: 'inherit' })
  })

  await runFixture('esm', async (dir) => {
    await writeJson(join(dir, 'package.json'), {
      name: 'esm-fixture',
      private: true,
      type: 'module',
      dependencies: { vue: '^3.4.0', 'portico-ui': `file:${tgzPath}` }
    })
    await writeFile(
      join(dir, 'index.mjs'),
      `import { PtButton, default as plugin } from 'portico-ui';
if (!PtButton?.name) throw new Error('PtButton missing');
if (typeof plugin?.install !== 'function') throw new Error('plugin.install missing');
console.log('esm', PtButton.name);
`
    )
    execSync('npm install', { cwd: dir, stdio: 'inherit' })
    execSync('node index.mjs', { cwd: dir, stdio: 'inherit' })
  })

  await runFixture('ts-strict', async (dir) => {
    await writeJson(join(dir, 'package.json'), {
      name: 'ts-fixture',
      private: true,
      type: 'module',
      devDependencies: { typescript: '5.9.3', vue: '3.5.22', 'portico-ui': `file:${tgzPath}` }
    })
    await writeJson(join(dir, 'tsconfig.json'), {
      compilerOptions: {
        strict: true,
        moduleResolution: 'bundler',
        module: 'ESNext',
        target: 'ES2022',
        skipLibCheck: false,
        noEmit: true,
        jsx: 'preserve'
      },
      include: ['app.ts']
    })
    await writeFile(
      join(dir, 'app.ts'),
      `import { PtButton, type ButtonProps } from 'portico-ui';
import { defineComponent, h } from 'vue';
const _props: ButtonProps = { type: 'primary' };
export default defineComponent({
  setup() {
    return () => h(PtButton, _props, () => 'ok');
  }
});
`
    )
    execSync('npm install', { cwd: dir, stdio: 'inherit' })
    execSync('npx tsc -p tsconfig.json', { cwd: dir, stdio: 'inherit' })
  })

  const tarballSha = execSync(`sha256sum "${tgzPath}"`, { encoding: 'utf8' }).trim().split(/\s+/)[0]
  const head = execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim()
  console.log(JSON.stringify({ ok: true, tgzPath, tarballSha, gitHead: head, packedVersion: JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8')).version }, null, 2))
  await rm(packDest, { recursive: true, force: true })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})