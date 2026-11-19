<script setup lang="ts">
import { computed } from 'vue'
import PtSpinner from '../icons/PtSpinner.vue'

export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ButtonSize = 'large' | 'default' | 'small'

export interface ButtonProps {
  type?: ButtonType
  plain?: boolean
  text?: boolean
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
  autofocus?: boolean
}

defineOptions({ name: 'PtButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'default',
  nativeType: 'button'
})

const classes = computed(() => [
  'pt-button',
  `pt-button--${props.type}`,
  `pt-button--${props.size}`,
  {
    'pt-button--plain': props.plain && !props.text,
    'pt-button--text': props.text,
    'is-disabled': props.disabled || props.loading,
    'is-loading': props.loading
  }
])
</script>

<template>
  <button
    :class="classes"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-busy="loading ? true : undefined"
    :autofocus="autofocus || undefined"
  >
    <pt-spinner v-if="loading" class="pt-button__spinner" />
    <span class="pt-button__content"><slot /></span>
  </button>
</template>
