<script setup lang="ts">
import { provide } from 'vue'
import { formContextKey, type FormItemContext } from './tokens'
import type { FormRules, FormValidateCallback, FormValidationError } from './types'

export interface FormProps {
  model?: Record<string, unknown>
  rules?: FormRules
  labelWidth?: string
  labelPosition?: 'right' | 'left' | 'top'
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  requireAsterisk?: boolean
  hideRequiredAsterisk?: boolean
}

defineOptions({ name: 'PtForm' })

const props = withDefaults(defineProps<FormProps>(), {
  labelPosition: 'right',
  requireAsterisk: true,
  hideRequiredAsterisk: false
})

const items = new Set<FormItemContext>()

provide(formContextKey, {
  get model() {
    return props.model ?? {}
  },
  get rules() {
    return props.rules
  },
  get labelWidth() {
    return props.labelWidth
  },
  get labelPosition() {
    return props.labelPosition
  },
  get disabled() {
    return props.disabled || false
  },
  get size() {
    return props.size
  },
  get requireAsterisk() {
    return !props.hideRequiredAsterisk && props.requireAsterisk
  },
  register(item) {
    items.add(item)
  },
  unregister(item) {
    items.delete(item)
  }
})

async function validate(callback?: FormValidateCallback): Promise<boolean> {
  const results = await Promise.all(Array.from(items).map((item) => item.validate()))
  const errors: FormValidationError[] = Array.from(items)
    .filter((item) => item.error && item.prop)
    .map((item) => ({ prop: item.prop as string, message: item.error }))
  const valid = results.every(Boolean) && errors.length === 0
  callback?.(valid, errors)
  if (!valid) {
    const error = new Error('Form validation failed') as Error & { errors: FormValidationError[] }
    error.errors = errors
    return Promise.reject(error)
  }
  return true
}

async function validateField(prop: string): Promise<boolean> {
  const item = Array.from(items).find((entry) => entry.prop === prop)
  if (!item) return true
  return item.validate()
}

function resetFields() {
  items.forEach((item) => item.resetField())
}

function clearValidate(prop?: string | string[]) {
  const list = !prop
    ? Array.from(items)
    : Array.from(items).filter((item) => (Array.isArray(prop) ? prop.includes(item.prop || '') : item.prop === prop))
  list.forEach((item) => item.clearValidate())
}

defineExpose({ validate, validateField, resetFields, clearValidate })
</script>

<template>
  <form
    class="pt-form"
    :class="[`pt-form--${labelPosition}`, { 'is-disabled': disabled }]"
    @submit.prevent
  >
    <slot />
  </form>
</template>
