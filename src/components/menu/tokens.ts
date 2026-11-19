import type { InjectionKey } from 'vue'

export interface MenuContext {
  mode: 'vertical' | 'horizontal'
  collapse: boolean
  active: string
  select: (index: string) => void
  router?: boolean
}

export const menuContextKey: InjectionKey<MenuContext> = Symbol('ptMenu')
