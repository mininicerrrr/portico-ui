import { computed, inject, type ComputedRef } from 'vue'
import { zhCN } from './zh-CN'
import { localeContextKey } from './token'
import type { PtLocale } from './types'

function readPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, source)
}

export function useLocale(): {
  locale: ComputedRef<PtLocale>
  t: (path: string, params?: Record<string, string | number>) => string
} {
  const injected = inject(localeContextKey, undefined)
  const locale = computed(() => injected?.value ?? zhCN)

  function t(path: string, params?: Record<string, string | number>): string {
    const value = readPath(locale.value, path)
    let text = typeof value === 'string' ? value : path
    if (params) {
      for (const [key, raw] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(raw))
      }
    }
    return text
  }

  return { locale, t }
}
