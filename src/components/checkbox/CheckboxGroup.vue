<script setup lang="ts">
import { inject, provide } from 'vue'
import { checkboxGroupKey } from './tokens'
import { formContextKey, formItemContextKey } from '../form/tokens'

export interface CheckboxGroupProps {
  modelValue?: Array<string | number | boolean>
  disabled?: boolean
}

defineOptions({ name: 'PtCheckboxGroup' })

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => []
})
const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number | boolean>]
  change: [value: Array<string | number | boolean>]
}>()

const formItem = inject(formItemContextKey, undefined)
const form = inject(formContextKey, undefined)

provide(checkboxGroupKey, {
  get modelValue() {
    return props.modelValue
  },
  get disabled() {
    return props.disabled || form?.disabled || false
  },
  toggle(value, checked) {
    const next = [...props.modelValue]
    const index = next.indexOf(value)
    if (checked && index === -1) next.push(value)
    if (!checked && index !== -1) next.splice(index, 1)
    emit('update:modelValue', next)
    emit('change', next)
    formItem?.setValue(next)
    formItem?.validate('change')
  }
})
</script>

<template>
  <div class="pt-checkbox-group" role="group" :id="formItem?.inputId">
    <slot />
  </div>
</template>
