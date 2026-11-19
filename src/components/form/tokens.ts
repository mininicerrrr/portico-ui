import type { InjectionKey } from 'vue'
import type { FormRules, FormValidateCallback, FormValidationError } from './types'

export interface FormContext {
  model: Record<string, unknown>
  rules?: FormRules
  labelWidth?: string
  labelPosition: 'right' | 'left' | 'top'
  disabled: boolean
  size?: 'large' | 'default' | 'small'
  requireAsterisk: boolean
  register: (item: FormItemContext) => void
  unregister: (item: FormItemContext) => void
}

export interface FormItemContext {
  prop?: string
  size?: 'large' | 'default' | 'small'
  inputId: string
  errorId: string
  error: string
  validate: (trigger?: string) => Promise<boolean>
  resetField: () => void
  clearValidate: () => void
  setValue: (value: unknown) => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('ptForm')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('ptFormItem')

export type { FormRules, FormValidateCallback, FormValidationError }
