<script setup lang="ts">
import { computed, inject } from 'vue'
import { checkboxGroupKey } from './tokens'
import { formContextKey, formItemContextKey } from '../form/tokens'
import { ptId } from '../../utils/id'
import PtIcon from '../icons/PtIcon.vue'
import { iconCheck } from '../icons/icons'

export interface CheckboxProps {
  modelValue?: boolean | Array<string | number | boolean>
  label?: string | number | boolean
  value?: string | number | boolean
  disabled?: boolean
  name?: string
  indeterminate?: boolean
}

defineOptions({ name: 'PtCheckbox' })

const props = defineProps<CheckboxProps>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean | Array<string | number | boolean>]
  change: [value: boolean]
}>()

const group = inject(checkboxGroupKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const form = inject(formContextKey, undefined)
const fallbackId = ptId('pt-checkbox')
const inputId = computed(() => (!group && formItem?.inputId) || fallbackId)
const optionValue = computed(() => props.value ?? props.label ?? true)
const isDisabled = computed(() => Boolean(props.disabled || group?.disabled || form?.disabled))
const checked = computed(() => {
  if (group) return group.modelValue.includes(optionValue.value)
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(optionValue.value)
  return Boolean(props.modelValue)
})

function onChange(event: Event) {
  const next = (event.target as HTMLInputElement).checked
  if (group) {
    group.toggle(optionValue.value, next)
  } else if (Array.isArray(props.modelValue)) {
    const copy = [...props.modelValue]
    const index = copy.indexOf(optionValue.value)
    if (next && index === -1) copy.push(optionValue.value)
    if (!next && index !== -1) copy.splice(index, 1)
    emit('update:modelValue', copy)
  } else {
    emit('update:modelValue', next)
    formItem?.setValue(next)
    formItem?.validate('change')
  }
  emit('change', next)
}
</script>

<template>
  <label class="pt-checkbox" :class="{ 'is-checked': checked, 'is-disabled': isDisabled, 'is-indeterminate': indeterminate }" :for="inputId">
    <input
      :id="inputId"
      class="pt-visually-hidden"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :checked="checked"
      :value="String(optionValue)"
      :indeterminate="indeterminate"
      :aria-checked="indeterminate ? 'mixed' : checked"
      @change="onChange"
    />
    <span class="pt-checkbox__box" aria-hidden="true">
      <pt-icon v-if="checked && !indeterminate" :path="iconCheck" />
      <span v-else-if="indeterminate" class="pt-checkbox__dash" />
    </span>
    <span v-if="$slots.default || label" class="pt-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
