/**
 * vue-tsc / rollup dts emits component types parameterized by `GlobalComponents`.
 * Vue 3.5+ expects `GlobalComponents` to satisfy `Record<string, Component>`.
 * Augment before declaration emit so consumer strict `tsc` does not TS2344.
 */
import type { Component } from 'vue'

declare module 'vue' {
  export interface GlobalComponents {
    [name: string]: Component
  }
}