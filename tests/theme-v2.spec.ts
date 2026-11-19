import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const themeCss = readFileSync(resolve(import.meta.dirname, '../src/styles/theme.css'), 'utf8')

describe('visual v2 theme tokens', () => {
  it('uses action blue and 1px control borders', () => {
    expect(themeCss).toContain('--pt-color-primary: #3473ce')
    expect(themeCss).toContain('--pt-color-primary-hover: #2f69bd')
    expect(themeCss).toContain('--pt-color-primary-active: #275aa3')
    expect(themeCss).toContain('--pt-border-width-control: 1px')
    expect(themeCss).toContain('--pt-radius-s: 6px')
  })

  it('deprecates lintels without removing token names', () => {
    expect(themeCss).toContain('--pt-lintel: 0px')
    expect(themeCss).not.toContain('lintel / threshold')
  })

  it('defines row hover distinct from selection', () => {
    expect(themeCss).toContain('--pt-bg-row-hover: #f7f9fc')
    expect(themeCss).toContain('--pt-bg-row-selected: #edf4ff')
  })

  it('includes dark error/disabled supplement tokens', () => {
    expect(themeCss).toContain('--pt-color-danger-focus-ring: #4a2b35')
    expect(themeCss).toContain('--pt-bg-disabled: #1b2533')
  })
})