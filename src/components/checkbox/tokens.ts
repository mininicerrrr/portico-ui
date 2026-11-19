import type { InjectionKey } from 'vue'

export interface CheckboxGroupContext {
  modelValue: Array<string | number | boolean>
  disabled: boolean
  toggle: (value: string | number | boolean, checked: boolean) => void
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('ptCheckboxGroup')
