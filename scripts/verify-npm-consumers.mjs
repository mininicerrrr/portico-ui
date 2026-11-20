#!/usr/bin/env node
/**
 * Pack tarball → clean consumer installs: CJS/ESM/runtime + strict TS (no skipLibCheck).
 * Writes consumer-matrix-evidence.json for release review.
 */
import { execSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packDest = join(repoRoot, '.consumer-pack-test')
const evidenceOut =
  process.env.CONSUMER_MATRIX_OUT ||
  join(repoRoot, '.consumer-pack-test', 'portico-ui-consumer-matrix-evidence.json')

const STRICT_TSCONFIG = {
  compilerOptions: {
    strict: true,
    moduleResolution: 'bundler',
    module: 'ESNext',
    target: 'ES2022',
    lib: ['ES2022', 'DOM'],
    skipLibCheck: false,
    noEmit: true,
    jsx: 'preserve'
  }
}

const VUE_SUPPORT =
  'peerDependencies vue ^3.4.0 — published .d.ts emitted against vue-dts-baseline@3.4.38; strict TS matrix 3.4.0/3.4.21/3.4.38/3.5.22/3.5.45 with TS 5.9.3 skipLibCheck:false'

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', ...opts })
}

function shInherit(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', ...opts })
}

function nodeVersion() {
  return process.version
}

function resolveNode24Bin() {
  if (process.env.NODE_24_BIN?.trim()) return process.env.NODE_24_BIN.trim()
  // Cloud VM may shadow `node` with /exec-daemon/node — use nvm's binary path directly.
  try {
    const nvmNode = sh(
      'bash -lc \'export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm which 24\''
    ).trim()
    if (nvmNode) return nvmNode
  } catch {
    /* nvm unavailable */
  }
  try {
    const cached = sh(
      "bash -lc 'ls -1d /opt/hostedtoolcache/node/24.*/x64/bin/node 2>/dev/null | tail -1'"
    ).trim()
    if (cached.includes('/24.')) return cached
  } catch {
    /* not on GitHub Actions */
  }
  throw new Error('Node 24 binary not found (set NODE_24_BIN or install Node 24)')
}

function assertPublishedDts(dtsPath) {
  const src = readFileSync(dtsPath, 'utf8')
  if (/vue-dts-baseline/.test(src)) {
    throw new Error('published index.d.ts must not reference vue-dts-baseline paths (consumers resolve `vue` only)')
  }
  if (/CreateComponentPublicInstanceWithMixins/.test(src)) {
    throw new Error('published index.d.ts must not reference Vue 3.5-only CreateComponentPublicInstanceWithMixins')
  }
  if (/declare\s+module\s+['"]vue['"]/.test(src)) {
    throw new Error('published index.d.ts must not declare module vue (avoids widening consumer namespace)')
  }
  if (/export interface GlobalComponents[\s\S]*\[name:\s*string\]/.test(src)) {
    throw new Error('published index.d.ts must not contain widened GlobalComponents index signature')
  }
  if (!/from 'vue'/.test(src)) {
    throw new Error('published index.d.ts must import types from `vue`')
  }
  return {
    importsFromVueOnly: true,
    noDeclareModuleVue: true,
    noVue35OnlyInstanceType: true,
    noGlobalIndexSignature: true
  }
}

function assertEsBundleVue34Safe(repoRoot) {
  const esPath = join(repoRoot, 'dist/portico-ui.es.js')
  const head = readFileSync(esPath, 'utf8').split('\n')[0] ?? ''
  if (/\buseId\b/.test(head)) {
    throw new Error('dist/portico-ui.es.js must not import useId (Vue 3.5-only breaks ^3.4 peers)')
  }
  return { esPath, importLineOk: true }
}

function assertTarballContainsCjs(tgzPath) {
  const entries = sh(`tar -tzf ${JSON.stringify(tgzPath)}`)
    .split('\n')
    .filter(Boolean)
  const needed = ['package/dist/portico-ui.cjs', 'package/dist/index.d.ts']
  for (const entry of needed) {
    if (!entries.includes(entry)) throw new Error(`tarball missing ${entry}`)
  }
  return { entries: needed }
}

async function runNode24InDir(dir) {
  const node24 = resolveNode24Bin()
  await writeFile(
    join(dir, 'node24.cjs'),
    `const p=require('portico-ui');
if (!p.PtButton) throw new Error('PtButton missing');
console.log('node24', process.version, p.PtButton.name, Object.keys(p).length);
`
  )
  return sh(`${JSON.stringify(node24)} node24.cjs`, { cwd: dir }).trim()
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`)
}

async function runFixture(name, fn) {
  const dir = await mkdtemp(join(tmpdir(), `portico-consumer-${name}-`))
  try {
    const result = await fn(dir)
    return { name, ok: true, ...result }
  } catch (err) {
    return { name, ok: false, error: String(err?.message || err) }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function tscExpect(dir, configName, includeFiles, expectErrors) {
  const cfg = { ...STRICT_TSCONFIG, include: includeFiles }
  await writeJson(join(dir, configName), cfg)
  const r = spawnSync('npx', ['tsc', '-p', configName], { cwd: dir, encoding: 'utf8' })
  const out = `${r.stdout || ''}${r.stderr || ''}`
  const failed = r.status !== 0
  if (expectErrors && !failed) {
    throw new Error(`expected tsc errors but compile passed\n${out}`)
  }
  if (!expectErrors && failed) {
    throw new Error(`tsc failed unexpectedly\n${out}`)
  }
  return { exitCode: r.status, expectErrors, sample: out.split('\n').slice(0, 4).join('\n') }
}

async function main() {
  shInherit('npm run build', { cwd: repoRoot })
  const publishedDts = join(repoRoot, 'dist/index.d.ts')
  const dtsChecks = assertPublishedDts(publishedDts)
  const esChecks = assertEsBundleVue34Safe(repoRoot)

  await mkdir(packDest, { recursive: true })
  const tgzName = sh(`npm pack --pack-destination ${packDest}`, { cwd: repoRoot })
    .trim()
    .split('\n')
    .pop()
  const tgzPath = join(packDest, tgzName)
  const tarballSha = sh(`sha256sum "${tgzPath}"`).trim().split(/\s+/)[0]
  const gitHead = sh('git rev-parse HEAD', { cwd: repoRoot }).trim()
  const packedVersion = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8')).version

  const tarballChecks = assertTarballContainsCjs(tgzPath)
  const matrix = [
    {
      name: 'published-dts-no-vue-namespace-augment',
      ok: true,
      ...dtsChecks,
      path: publishedDts
    },
    {
      name: 'tarball-includes-cjs-entry',
      ok: true,
      ...tarballChecks,
      tarballSha256: tarballSha
    },
    {
      name: 'es-bundle-no-vue-useId-import',
      ok: true,
      ...esChecks
    }
  ]

  matrix.push(
    await runFixture('cjs-node22-createRequire', async (dir) => {
      await writeJson(join(dir, 'package.json'), {
        name: 'cjs-fixture',
        private: true,
        type: 'commonjs',
        dependencies: { vue: '3.5.45', 'portico-ui': `file:${tgzPath}` }
      })
      await writeFile(
        join(dir, 'index.cjs'),
        `const { createRequire } = require('module');
const portico = require('portico-ui');
const viaCr = createRequire(__filename)('portico-ui');
for (const [label, mod] of [['require', portico], ['createRequire', viaCr]]) {
  if (Object.keys(mod).length < 3) throw new Error(label + ' empty export');
  if (!mod.PtButton) throw new Error(label + ' PtButton missing');
  if (typeof mod.default?.install !== 'function') throw new Error(label + ' install missing');
}
console.log('ok', process.version);
`
      )
      shInherit('npm install', { cwd: dir })
      shInherit('node index.cjs', { cwd: dir })
      return { node: nodeVersion(), vue: '3.5.45', command: 'node index.cjs' }
    })
  )

  for (const vueVer of ['3.4.0', '3.4.38']) {
    matrix.push(
      await runFixture(`esm-import-vue-${vueVer.replace(/\./g, '-')}`, async () => {
        const out = sh(`node scripts/consumer-runtime-vue34.mjs ${vueVer} ${JSON.stringify(tgzPath)}`, {
          cwd: repoRoot
        }).trim()
        const parsed = JSON.parse(out)
        if (!parsed.ok) throw new Error(parsed.error || 'runtime mount failed')
        return { vue: vueVer, packInstall: true, checks: parsed.checks }
      })
    )
  }

  matrix.push(
    await runFixture('esm-import', async (dir) => {
      await writeJson(join(dir, 'package.json'), {
        name: 'esm-fixture',
        private: true,
        type: 'module',
        dependencies: { vue: '3.5.45', 'portico-ui': `file:${tgzPath}` }
      })
      await writeFile(
        join(dir, 'index.mjs'),
        `import { PtButton, default as plugin } from 'portico-ui';
if (!PtButton?.name) throw new Error('PtButton missing');
if (typeof plugin?.install !== 'function') throw new Error('install missing');
`
      )
      shInherit('npm install', { cwd: dir })
      shInherit('node index.mjs', { cwd: dir })
      return { vue: '3.5.45' }
    })
  )

  matrix.push(
    await runFixture('esm-namespace-import', async (dir) => {
      await writeJson(join(dir, 'package.json'), {
        name: 'esm-ns-fixture',
        private: true,
        type: 'module',
        dependencies: { vue: '3.5.45', 'portico-ui': `file:${tgzPath}` }
      })
      await writeFile(
        join(dir, 'index.mjs'),
        `import * as Portico from 'portico-ui';
if (!Portico.PtButton?.name) throw new Error('PtButton missing on namespace');
if (typeof Portico.default?.install !== 'function') throw new Error('default.install missing');
`
      )
      shInherit('npm install', { cwd: dir })
      shInherit('node index.mjs', { cwd: dir })
      return { vue: '3.5.45', pattern: 'import * as Portico' }
    })
  )

  matrix.push(
    await runFixture('runtime-cjs-vue-3.4.38-boundary', async (dir) => {
      await writeJson(join(dir, 'package.json'), {
        name: 'vue34-runtime',
        private: true,
        type: 'commonjs',
        dependencies: { vue: '3.4.38', 'portico-ui': `file:${tgzPath}` }
      })
      await writeFile(
        join(dir, 'index.cjs'),
        `const p=require('portico-ui');
if (!p.PtButton) throw new Error('PtButton missing');
console.log('vue', '3.4.38', 'keys', Object.keys(p).length);
`
      )
      shInherit('npm install', { cwd: dir })
      shInherit('node index.cjs', { cwd: dir })
      return { note: 'runtime CJS at peer lower bound (types covered by strict TS matrix)' }
    })
  )

  for (const vueVer of ['3.4.0', '3.4.21', '3.4.38', '3.5.22', '3.5.45']) {
    matrix.push(
      await runFixture(`ts-strict-positive-vue-${vueVer}`, async (dir) => {
        await writeJson(join(dir, 'package.json'), {
          name: 'ts-positive',
          private: true,
          type: 'module',
          devDependencies: { typescript: '5.9.3', vue: vueVer, 'portico-ui': `file:${tgzPath}` }
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
        shInherit('npm install', { cwd: dir })
        const tsc = await tscExpect(dir, 'tsconfig.json', ['app.ts'], false)
        return { vue: vueVer, typescript: '5.9.3', strict: true, skipLibCheck: false, tsc }
      })
    )
  }

  for (const vueVer of ['3.4.38', '3.5.45']) {
    matrix.push(
      await runFixture(`ts-strict-negative-invalid-button-prop-vue-${vueVer.replace(/\./g, '-')}`, async (dir) => {
        await writeJson(join(dir, 'package.json'), {
          name: 'ts-negative',
          private: true,
          type: 'module',
          devDependencies: { typescript: '5.9.3', vue: vueVer, 'portico-ui': `file:${tgzPath}` }
        })
        await writeFile(
          join(dir, 'bad-props.ts'),
          `import { type ButtonProps } from 'portico-ui';
const bad: ButtonProps = { type: 'phantom-not-a-button-type' };
void bad;
`
        )
        shInherit('npm install', { cwd: dir })
        const tsc = await tscExpect(dir, 'tsconfig.json', ['bad-props.ts'], true)
        return { vue: vueVer, assertion: 'invalid ButtonProps.type must error', tsc }
      })
    )
  }

  matrix.push(
    await runFixture('ts-strict-negative-unknown-export', async (dir) => {
      await writeJson(join(dir, 'package.json'), {
        name: 'ts-unknown',
        private: true,
        type: 'module',
        devDependencies: { typescript: '5.9.3', vue: '3.5.45', 'portico-ui': `file:${tgzPath}` }
      })
      await writeFile(
        join(dir, 'bad-import.ts'),
        `import { PtDoesNotExist } from 'portico-ui';
void PtDoesNotExist;
`
      )
      shInherit('npm install', { cwd: dir })
      const tsc = await tscExpect(dir, 'tsconfig.json', ['bad-import.ts'], true)
      return { assertion: 'non-exported symbol must error', tsc }
    })
  )

  matrix.push(
    await runFixture('ts-augmentation-globalcomponents-compat', async (dir) => {
      await writeJson(join(dir, 'package.json'), {
        name: 'ts-augment',
        private: true,
        type: 'module',
        devDependencies: { typescript: '5.9.3', vue: '3.5.45', 'portico-ui': `file:${tgzPath}` }
      })
      await writeFile(
        join(dir, 'env.d.ts'),
        `export {};
declare module 'vue' {
  export interface GlobalComponents {
    LocalWidget: import('vue').DefineComponent<{ msg: string }, {}, {}>;
  }
}
`
      )
      await writeFile(
        join(dir, 'app.ts'),
        `import { PtButton, type ButtonProps } from 'portico-ui';
import { defineComponent, h, type DefineComponent } from 'vue';
export const LocalWidget = defineComponent({
  props: { msg: String },
  setup(props) {
    return () => props.msg;
  }
}) as DefineComponent<{ msg: string }, {}, {}>;
const p: ButtonProps = { type: 'default' };
export default defineComponent({
  setup() {
    return () => h(PtButton, p);
  }
});
`
      )
      shInherit('npm install', { cwd: dir })
      const tsc = await tscExpect(dir, 'tsconfig.json', ['env.d.ts', 'app.ts'], false)
      return { assertion: 'consumer GlobalComponents augmentation + portico import', tsc }
    })
  )

  matrix.push(
    await runFixture('cjs-node24-pack', async (dir) => {
      await writeJson(join(dir, 'package.json'), {
        name: 'cjs-node24',
        private: true,
        type: 'commonjs',
        dependencies: { vue: '3.5.45', 'portico-ui': `file:${tgzPath}` }
      })
      shInherit('npm install', { cwd: dir })
      const output = await runNode24InDir(dir)
      if (!output.startsWith('node24 v24.')) {
        throw new Error(`expected Node 24 process, got: ${output}`)
      }
      return { output }
    })
  )

  const failures = matrix.filter((m) => m.ok === false)
  const ok = failures.length === 0
  if (process.env.EXPECT_TARBALL_SHA256 && process.env.EXPECT_TARBALL_SHA256 !== tarballSha) {
    throw new Error(
      `packed tarball sha256 mismatch: expected ${process.env.EXPECT_TARBALL_SHA256}, got ${tarballSha}`
    )
  }
  if (process.env.EXPECT_GIT_HEAD && process.env.EXPECT_GIT_HEAD !== gitHead) {
    throw new Error(`git head mismatch: expected ${process.env.EXPECT_GIT_HEAD}, got ${gitHead}`)
  }
  if (process.env.EXPECT_PACKED_VERSION && process.env.EXPECT_PACKED_VERSION !== packedVersion) {
    throw new Error(
      `packed version mismatch: expected ${process.env.EXPECT_PACKED_VERSION}, got ${packedVersion}`
    )
  }
  const report = {
    capturedAt: new Date().toISOString(),
    ok,
    failures: failures.length,
    gitHead,
    packedVersion,
    tarballPath: tgzPath,
    tarballSha256: tarballSha,
    vueSupportDeclared: VUE_SUPPORT,
    typescript: '5.9.3',
    nodeHost: nodeVersion(),
    strictLibCheck: { strict: true, skipLibCheck: false },
    dtsPatchNote:
      'dts emit via tsconfig.dts.json + vue-dts-baseline@3.4.38; patch-published-dts rewrites baseline paths to `vue` and strips declare-module vue widening',
    matrix
  }
  await mkdir(dirname(evidenceOut), { recursive: true })
  await writeFile(evidenceOut, JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ ok: failures.length === 0, failures: failures.length, evidenceOut, gitHead, tarballSha }, null, 2))
  await rm(tgzPath, { force: true })
  if (failures.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})