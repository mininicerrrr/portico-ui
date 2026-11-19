<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from 'vue'
import { formContextKey, formItemContextKey, type FormItemContext, type FormValidateStatus } from './tokens'
import type { FormRule } from './types'
import { getPath, setPath } from '../../utils/dom'
import { ptId } from '../../utils/id'
import { useLocale } from '../../locale'

export interface FormItemProps {
  label?: string
  prop?: string
  required?: boolean
  rules?: FormRule | FormRule[]
  error?: string
  labelWidth?: string
  showMessage?: boolean
  size?: 'large' | 'default' | 'small'
  validateStatus?: FormValidateStatus
}

defineOptions({ name: 'PtFormItem' })

const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: true
})

const form = inject(formContextKey, undefined)
const { t } = useLocale()
const inputId = ptId('pt-field')
const errorId = `${inputId}-error`
const innerError = ref('')
const initialValue = ref<unknown>(undefined)
const currentValue = ref<unknown>(undefined)
const initialized = ref(false)

const errorMessage = computed(() => props.error ?? innerError.value)
const labelWidth = computed(() => props.labelWidth || form?.labelWidth || 'var(--pt-form-label-width)')
const position = computed(() => form?.labelPosition || 'right')
const size = computed(() => props.size || form?.size || 'default')

const validateState = computed<FormValidateStatus>(() => {
  if (props.validateStatus != null && props.validateStatus !== '') return props.validateStatus
  if (errorMessage.value) return 'error'
  return ''
})

function normalizeRules(): FormRule[] {
  const fromProp = props.rules
  const fromForm = props.prop && form?.rules ? form.rules[props.prop] : undefined
  const list = [...(fromProp ? (Array.isArray(fromProp) ? fromProp : [fromProp]) : []), ...(fromForm ? (Array.isArray(fromForm) ? fromForm : [fromForm]) : [])]
  if (props.required && !list.some((rule) => rule.required)) {
    list.unshift({ required: true, message: t('form.required'), trigger: ['blur', 'change'] })
  }
  return list
}

const isRequired = computed(() => props.required || normalizeRules().some((rule) => rule.required))

function readValue(): unknown {
  if (!form || !props.prop) return currentValue.value
  return getPath(form.model, props.prop)
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

async function runRule(rule: FormRule, value: unknown): Promise<string | null> {
  if (rule.required && isEmpty(value)) return rule.message || t('form.required')
  if (value == null || value === '') return null
  if (typeof value === 'string' || Array.isArray(value)) {
    if (rule.min != null && value.length < rule.min) return rule.message || t('form.min', { min: rule.min })
    if (rule.max != null && value.length > rule.max) return rule.message || t('form.max', { max: rule.max })
  }
  if (typeof value === 'string' && rule.pattern && !rule.pattern.test(value)) {
    return rule.message || t('form.invalidFormat')
  }
  if (rule.validator) {
    const result = await rule.validator(value)
    if (result === false) return rule.message || t('form.invalid')
    if (typeof result === 'string' && result) return result
  }
  return null
}

async function validate(trigger?: string): Promise<boolean> {
  const value = readValue()
  currentValue.value = value
  const rules = normalizeRules().filter((rule) => {
    if (!trigger) return true
    const trig = rule.trigger
    if (!trig) return true
    return Array.isArray(trig) ? trig.includes(trigger as 'blur' | 'change') : trig === trigger
  })
  for (const rule of rules) {
    const message = await runRule(rule, value)
    if (message) {
      innerError.value = message
      ctx.error = message
      return false
    }
  }
  innerError.value = ''
  ctx.error = ''
  return true
}

function resetField() {
  if (form && props.prop) setPath(form.model, props.prop, initialValue.value)
  currentValue.value = initialValue.value
  clearValidate()
}

function clearValidate() {
  innerError.value = ''
  ctx.error = ''
}

function setValue(value: unknown) {
  currentValue.value = value
  if (!initialized.value) {
    initialValue.value = Array.isArray(value) ? [...value] : value
    initialized.value = true
  }
}

const ctx: FormItemContext = reactive({
  prop: props.prop,
  size: size.value,
  inputId,
  errorId,
  error: '',
  validateState: '' as FormValidateStatus,
  validate,
  resetField,
  clearValidate,
  setValue
})

watch(
  () => props.prop,
  (prop) => {
    ctx.prop = prop
  }
)

watch(
  size,
  (value) => {
    ctx.size = value
  }
)

watch(
  errorMessage,
  (value) => {
    ctx.error = value || ''
  },
  { immediate: true }
)

watch(
  validateState,
  (value) => {
    ctx.validateState = value
  },
  { immediate: true }
)

provide(formItemContextKey, ctx)

onMounted(() => {
  const value = readValue()
  if (!initialized.value) {
    initialValue.value = Array.isArray(value) ? [...value] : value
    currentValue.value = value
    initialized.value = true
  }
  form?.register(ctx)
})

onBeforeUnmount(() => form?.unregister(ctx))
</script>

<template>
  <div
    class="pt-form-item"
    :class="[
      `pt-form-item--${position}`,
      `pt-form-item--${size}`,
      {
        'is-error': validateState === 'error',
        'is-success': validateStatus === 'success',
        'is-required': isRequired && form?.requireAsterisk
      }
    ]"
  >
    <label
      v-if="label || $slots.label"
      class="pt-form-item__label"
      :for="inputId"
      :style="position !== 'top' ? { width: labelWidth } : undefined"
    >
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="pt-form-item__content">
      <slot />
      <div v-if="showMessage && validateState === 'error' && errorMessage" :id="errorId" class="pt-form-item__error" role="alert">{{ errorMessage }}</div>
    </div>
  </div>
</template>
