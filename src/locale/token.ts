import type { InjectionKey, Ref } from 'vue'
import type { PtLocale } from './types'

export const localeContextKey: InjectionKey<Ref<PtLocale>> = Symbol('ptLocale')
