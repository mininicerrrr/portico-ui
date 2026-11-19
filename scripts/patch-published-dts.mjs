#!/usr/bin/env node
/**
 * Post-process rolled dist/index.d.ts for published consumers.
 * - Normalize vue-dts-baseline path imports back to `vue` (peer resolves consumer copy).
 * - Replace rolled GlobalComponents/Directives imports with local Record aliases when present.
 * - Never ship `declare module 'vue'` namespace widening.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dtsPath = resolve(import.meta.dirname, '../dist/index.d.ts')

let src = readFileSync(dtsPath, 'utf8')

src = src.replace(
  /from ['"](?:\.\.\/)+node_modules\/vue-dts-baseline\/dist\/vue\.d\.ts['"]/g,
  "from 'vue'"
)

src = src.replace(
  /import \{ GlobalComponents \} from 'vue';\r?\n/,
  'type GlobalComponents = Record<string, import("vue").Component>;\n'
)
src = src.replace(
  /import \{ GlobalDirectives \} from 'vue';\r?\n/,
  'type GlobalDirectives = Record<string, import("vue").Directive>;\n'
)
src = src.replace(/\ndeclare module 'vue' \{[\s\S]*?export interface GlobalComponents[\s\S]*?\}\n\}/, '')

writeFileSync(dtsPath, `${src.trimEnd()}\n`)