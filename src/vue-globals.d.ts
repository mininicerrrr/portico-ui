/**
 * Build-time only (not copied into published dist/index.d.ts).
 * vue-tsc / rollup dts emit component types parameterized by `GlobalComponents`.
 * `scripts/patch-published-dts.mjs` rewrites rolled imports to local Record<> aliases
 * and strips any emitted `declare module 'vue'` — consumers must not receive namespace widening.
 */
import type { Component } from 'vue'

declare module 'vue' {
  export interface GlobalComponents {
    [name: string]: Component
  }
}