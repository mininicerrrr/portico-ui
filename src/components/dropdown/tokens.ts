import type { InjectionKey } from 'vue'

export interface DropdownContext {
  handleCommand: (command: string | number | object) => void
  close: () => void
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('ptDropdown')
