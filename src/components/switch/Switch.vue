<script setup lang="ts">
import { computed, inject } from 'vue'
import { formItemContextKey } from '../form/tokens'
import { ptId } from '../../utils/id'
import { useFormDisabled } from '../../utils/use-form-disabled'
import PtSpinner from '../icons/PtSpinner.vue'

export interface SwitchProps {
  modelValue?: boolean | string | number
  disabled?: boolean
  loading?: boolean
  activeValue?: boolean | string | number
  inactiveValue?: boolean | string | number
  activeText?: string
  inactiveText?: string
  size?: 'large' | 'default' | 'small'
}

defineOptions({ name: 'PtSwitch' })

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
  size: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | number]
  change: [value: boolean | string | number]
}>()

const formItem = inject(formItemContextKey, undefined)
const fallbackId = ptId('pt-switch')
const inputId = computed(() => formItem?.inputId || fallbackId)
const isChecked = computed(() => props.modelValue === props.activeValue)
const isDisabled = useFormDisabled(() => props.disabled || props.loading)

function toggle() {
  if (isDisabled.value) return
  const next = isChecked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', next)
  emit('change', next)
  formItem?.setValue(next)
  formItem?.validate('change')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
  }
}
</script>

<template>
  <span class="pt-switch" :class="[`pt-switch--${size}`, { 'is-checked': isChecked, 'is-disabled': isDisabled, 'is-loading': loading }]">
    <span v-if="inactiveText" class="pt-switch__label" :class="{ 'is-active': !isChecked }">{{ inactiveText }}</span>
    <button
      :id="inputId"
      type="button"
      class="pt-switch__track"
      role="switch"
      :aria-checked="isChecked"
      :aria-label="activeText || inactiveText || undefined"
      :disabled="isDisabled"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="pt-switch__thumb">
        <pt-spinner v-if="loading" />
      </span>
    </button>
    <span v-if="activeText" class="pt-switch__label" :class="{ 'is-active': isChecked }">{{ activeText }}</span>
  </span>
</template>
