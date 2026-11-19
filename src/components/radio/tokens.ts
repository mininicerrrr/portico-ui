import type { InjectionKey } from 'vue'

export interface RadioGroupContext {
  modelValue: string | number | boolean | undefined
  disabled: boolean
  name: string
  select: (value: string | number | boolean) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('ptRadioGroup')
