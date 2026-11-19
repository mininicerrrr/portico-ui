import type { InjectionKey } from 'vue'

export interface SelectOptionData {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface SelectContext {
  selected: unknown
  highlighted: unknown
  optionId: (value: SelectOptionData['value']) => string
  register: (option: SelectOptionData) => void
  unregister: (value: SelectOptionData['value']) => void
  select: (option: SelectOptionData) => void
}

export const selectContextKey: InjectionKey<SelectContext> = Symbol('ptSelect')
