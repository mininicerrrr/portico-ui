<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { formItemContextKey } from '../form/tokens'
import { useFormDisabled } from '../../utils/use-form-disabled'

export interface TextareaAutosize {
  minRows?: number
  maxRows?: number
}

export interface TextareaProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  rows?: number
  autosize?: boolean | TextareaAutosize
  maxlength?: number | string
  showWordLimit?: boolean
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  id?: string
  name?: string
  ariaLabel?: string
}

defineOptions({ name: 'PtTextarea' })

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  rows: 3,
  resize: 'vertical'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const formItem = inject(formItemContextKey, undefined)
const areaRef = ref<HTMLTextAreaElement>()
const focused = ref(false)
const inputId = computed(() => props.id || formItem?.inputId)
const isDisabled = useFormDisabled(() => props.disabled)
const validateState = computed(() => formItem?.validateState || '')
const text = computed(() => String(props.modelValue ?? ''))
const count = computed(() => Array.from(text.value).length)
const max = computed(() => (props.maxlength != null ? Number(props.maxlength) : undefined))

function setValue(value: string) {
  emit('update:modelValue', value)
  emit('input', value)
  formItem?.setValue(value)
  resizeToFit()
}

function onInput(event: Event) {
  setValue((event.target as HTMLTextAreaElement).value)
}

function onChange(event: Event) {
  emit('change', (event.target as HTMLTextAreaElement).value)
  formItem?.validate('change')
}

function onFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
  formItem?.validate('blur')
}

function resizeToFit() {
  if (!props.autosize || !areaRef.value) return
  const el = areaRef.value
  const style = getComputedStyle(el)
  const line = Number.parseFloat(style.lineHeight) || 21
  const pad = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)
  const border = Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth)
  const conf = typeof props.autosize === 'object' ? props.autosize : {}
  const minRows = conf.minRows ?? props.rows
  const maxRows = conf.maxRows
  el.style.height = 'auto'
  let height = el.scrollHeight
  const min = minRows * line + pad + border
  const maxH = maxRows ? maxRows * line + pad + border : Infinity
  height = Math.min(Math.max(height, min), maxH)
  el.style.height = `${height}px`
}

watch(() => props.modelValue, () => nextTick(resizeToFit))
onMounted(() => {
  if (props.modelValue != null && formItem) formItem.setValue(props.modelValue)
  resizeToFit()
})

defineExpose({ focus: () => areaRef.value?.focus(), blur: () => areaRef.value?.blur(), textarea: areaRef })
</script>

<template>
  <div
    class="pt-textarea"
    :class="{
      'is-disabled': isDisabled,
      'is-focus': focused,
      'is-error': validateState === 'error',
      'is-success': validateState === 'success'
    }"
  >
    <textarea
      :id="inputId"
      ref="areaRef"
      class="pt-textarea__inner"
      :value="text"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :rows="rows"
      :maxlength="maxlength"
      :name="name"
      :aria-label="ariaLabel"
      :aria-invalid="validateState === 'error' ? true : undefined"
      :aria-describedby="validateState === 'error' ? formItem?.errorId : undefined"
      :style="{ resize: autosize ? 'none' : resize }"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span v-if="showWordLimit && max != null" class="pt-textarea__count">{{ count }} / {{ max }}</span>
  </div>
</template>
