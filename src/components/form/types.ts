export interface FormRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  trigger?: 'blur' | 'change' | ('blur' | 'change')[]
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>
}

export type FormRules = Record<string, FormRule | FormRule[]>

export interface FormValidationError {
  prop: string
  message: string
}

export type FormValidateCallback = (valid: boolean, errors: FormValidationError[]) => void
