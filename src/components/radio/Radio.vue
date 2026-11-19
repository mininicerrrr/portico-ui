<script setup lang="ts">
import { computed, inject } from 'vue'
import { radioGroupKey } from './tokens'
import { formContextKey, formItemContextKey } from '../form/tokens'
import { ptId } from '../../utils/id'

export interface RadioProps {
  modelValue?: string | number | boolean
  label?: string | number | boolean
  value?: string | number | boolean
  disabled?: boolean
  name?: string
}

defineOptions({ name: 'PtRadio' })

const props = defineProps<RadioProps>()
const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

const group = inject(radioGroupKey, undefined)
const formItem = inject(formItemContextKey, undefined)
const form = inject(formContextKey, undefined)
const fallbackId = ptId('pt-radio')
const inputId = computed(() => (!group && formItem?.inputId) || fallbackId)
const optionValue = computed(() => props.value ?? props.label ?? '')
const isDisabled = computed(() => Boolean(props.disabled || group?.disabled || form?.disabled))
const checked = computed(() => (group ? group.modelValue === optionValue.value : props.modelValue === optionValue.value))
const inputName = computed(() => props.name || group?.name)

function onChange() {
  if (isDisabled.value) return
  if (group) group.select(optionValue.value)
  else {
    emit('update:modelValue', optionValue.value)
    formItem?.setValue(optionValue.value)
    formItem?.validate('change')
  }
  emit('change', optionValue.value)
}
</script>

<template>
  <label class="pt-radio" :class="{ 'is-checked': checked, 'is-disabled': isDisabled }" :for="inputId">
    <input
      :id="inputId"
      class="pt-visually-hidden"
      type="radio"
      :name="inputName"
      :disabled="isDisabled"
      :checked="checked"
      :value="String(optionValue)"
      @change="onChange"
    />
    <span class="pt-radio__dot" aria-hidden="true" />
    <span v-if="$slots.default || label" class="pt-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
