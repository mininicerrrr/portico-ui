<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { formItemContextKey } from '../form/tokens'
import { useFormDisabled } from '../../utils/use-form-disabled'
import PtIcon from '../icons/PtIcon.vue'
import { iconMinus, iconPlus } from '../icons/icons'

export type InputNumberSize = 'large' | 'default' | 'small'

export interface InputNumberProps {
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  precision?: number
  disabled?: boolean
  size?: InputNumberSize
  controls?: boolean
  placeholder?: string
  id?: string
  name?: string
  ariaLabel?: string
}

defineOptions({ name: 'PtInputNumber' })

const props = withDefaults(defineProps<InputNumberProps>(), {
  step: 1,
  controls: true
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [value: number | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const formItem = inject(formItemContextKey, undefined)
const focused = ref(false)
const draft = ref('')
const inputRef = ref<HTMLInputElement>()
const inputId = computed(() => props.id || formItem?.inputId)
const isDisabled = useFormDisabled(() => props.disabled)
const size = computed(() => props.size || formItem?.size || 'default')
const validateState = computed(() => formItem?.validateState || '')

function toPrecision(value: number): number {
  if (props.precision == null) {
    const stepDecimals = String(props.step).split('.')[1]?.length ?? 0
    const valueDecimals = String(value).split('.')[1]?.length ?? 0
    const digits = Math.max(stepDecimals, valueDecimals)
    return Number(value.toFixed(digits))
  }
  return Number(value.toFixed(props.precision))
}

function clamp(value: number): number {
  let next = toPrecision(value)
  if (props.min != null && next < props.min) next = props.min
  if (props.max != null && next > props.max) next = props.max
  return toPrecision(next)
}

function display(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return ''
  return props.precision != null ? value.toFixed(props.precision) : String(value)
}

const text = computed(() => (focused.value ? draft.value : display(props.modelValue ?? null)))
const atMin = computed(() => props.modelValue != null && props.min != null && props.modelValue <= props.min)
const atMax = computed(() => props.modelValue != null && props.max != null && props.modelValue >= props.max)

function apply(value: number | null, emitChange = true) {
  emit('update:modelValue', value)
  if (emitChange) emit('change', value)
  formItem?.setValue(value)
  if (emitChange) formItem?.validate('change')
}

function stepBy(delta: number) {
  if (isDisabled.value) return
  const base = props.modelValue == null || Number.isNaN(props.modelValue) ? 0 : props.modelValue
  apply(clamp(base + delta * props.step))
}

function parseDraft(): number | null {
  if (draft.value.trim() === '') return null
  const num = Number(draft.value)
  if (Number.isNaN(num)) return props.modelValue ?? null
  return clamp(num)
}

function onFocus(event: FocusEvent) {
  focused.value = true
  draft.value = display(props.modelValue ?? null)
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  focused.value = false
  apply(parseDraft())
  emit('blur', event)
  formItem?.validate('blur')
}

function onInput(event: Event) {
  draft.value = (event.target as HTMLInputElement).value
}

defineExpose({ focus: () => inputRef.value?.focus(), blur: () => inputRef.value?.blur() })
</script>

<template>
  <div
    class="pt-input-number"
    :class="[
      `pt-input-number--${size}`,
      {
        'is-disabled': isDisabled,
        'is-focus': focused,
        'is-error': validateState === 'error',
        'is-success': validateState === 'success',
        'has-controls': controls
      }
    ]"
  >
    <button
      v-if="controls"
      type="button"
      class="pt-input-number__btn is-minus"
      :disabled="isDisabled || atMin"
      tabindex="-1"
      @click="stepBy(-1)"
    >
      <pt-icon :path="iconMinus" />
    </button>
    <input
      :id="inputId"
      ref="inputRef"
      class="pt-input-number__inner"
      :value="text"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :name="name"
      :aria-label="ariaLabel"
      :aria-invalid="validateState === 'error' ? true : undefined"
      role="spinbutton"
      :aria-valuenow="modelValue ?? undefined"
      :aria-valuemin="min"
      :aria-valuemax="max"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.up.prevent="stepBy(1)"
      @keydown.down.prevent="stepBy(-1)"
    />
    <button
      v-if="controls"
      type="button"
      class="pt-input-number__btn is-plus"
      :disabled="isDisabled || atMax"
      tabindex="-1"
      @click="stepBy(1)"
    >
      <pt-icon :path="iconPlus" />
    </button>
  </div>
</template>
