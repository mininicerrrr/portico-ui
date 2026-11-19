#!/usr/bin/env node
/** Post-process rolled dist/index.d.ts for Vue 3.5+ strict consumer TS (TS2344). */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dtsPath = resolve(import.meta.dirname, '../dist/index.d.ts')

let src = readFileSync(dtsPath, 'utf8')
src = src.replace(
  /import \{ GlobalComponents \} from 'vue';\r?\n/,
  'type GlobalComponents = Record<string, import("vue").Component>;\n'
)
src = src.replace(
  /import \{ GlobalDirectives \} from 'vue';\r?\n/,
  'type GlobalDirectives = Record<string, import("vue").Directive>;\n'
)
src = src.replace(/\ndeclare module 'vue' \{[\s\S]*?export interface GlobalComponents[\s\S]*?\}\n\}/, '')
writeFileSync(
  dtsPath,
  `${src.trimEnd()}\n\ndeclare module 'vue' {\n  export interface GlobalComponents {\n    [name: string]: import('vue').Component\n  }\n}\n`
)