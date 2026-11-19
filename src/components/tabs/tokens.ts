import type { InjectionKey } from 'vue'

export interface TabPaneRegistered {
  name: string | number
  label?: string
  disabled?: boolean
}

export interface TabsContext {
  active: string | number | undefined
  register: (pane: TabPaneRegistered) => void
  unregister: (name: string | number) => void
}

export const tabsContextKey: InjectionKey<TabsContext> = Symbol('ptTabs')
