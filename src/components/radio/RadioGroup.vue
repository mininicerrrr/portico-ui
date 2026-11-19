<script setup lang="ts">
import { inject, provide } from 'vue'
import { radioGroupKey } from './tokens'
import { formContextKey, formItemContextKey } from '../form/tokens'
import { ptId } from '../../utils/id'

export interface RadioGroupProps {
  modelValue?: string | number | boolean
  disabled?: boolean
  name?: string
}

defineOptions({ name: 'PtRadioGroup' })

const props = defineProps<RadioGroupProps>()
const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

const formItem = inject(formItemContextKey, undefined)
const form = inject(formContextKey, undefined)
const groupName = props.name || ptId('pt-radio-group')

provide(radioGroupKey, {
  get modelValue() {
    return props.modelValue
  },
  get disabled() {
    return props.disabled || form?.disabled || false
  },
  name: groupName,
  select(value) {
    emit('update:modelValue', value)
    emit('change', value)
    formItem?.setValue(value)
    formItem?.validate('change')
  }
})
</script>

<template>
  <div class="pt-radio-group" role="radiogroup" :id="formItem?.inputId">
    <slot />
  </div>
</template>
