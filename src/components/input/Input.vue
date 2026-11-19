<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { formItemContextKey } from '../form/tokens'
import { useFormDisabled } from '../../utils/use-form-disabled'
import PtIcon from '../icons/PtIcon.vue'
import { iconClear, iconEye, iconEyeOff } from '../icons/icons'

export type InputSize = 'large' | 'default' | 'small'

export interface InputProps {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  showPassword?: boolean
  size?: InputSize
  maxlength?: number | string
  minlength?: number | string
  autocomplete?: string
  name?: string
  id?: string
  ariaLabel?: string
}

defineOptions({ name: 'PtInput' })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const formItem = inject(formItemContextKey, undefined)
const focused = ref(false)
const hovering = ref(false)
const passwordVisible = ref(false)
const inputRef = ref<HTMLInputElement>()

const inputId = computed(() => props.id || formItem?.inputId)
const isDisabled = useFormDisabled(() => props.disabled)
const size = computed(() => props.size || formItem?.size || 'default')
const isPassword = computed(() => props.showPassword || props.type === 'password')
const nativeType = computed(() => {
  if (isPassword.value) return passwordVisible.value ? 'text' : 'password'
  return props.type
})
const text = computed(() => String(props.modelValue ?? ''))
const showClear = computed(
  () =>
    props.clearable &&
    !isDisabled.value &&
    !props.readonly &&
    text.value.length > 0 &&
    (focused.value || hovering.value)
)
const showPwd = computed(() => isPassword.value && !isDisabled.value && text.value.length > 0)

function setValue(value: string) {
  emit('update:modelValue', value)
  emit('input', value)
  formItem?.setValue(value)
}

function onInput(event: Event) {
  setValue((event.target as HTMLInputElement).value)
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('change', value)
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

function clear() {
  setValue('')
  emit('clear')
  emit('change', '')
  formItem?.validate('change')
  inputRef.value?.focus()
}

function togglePassword() {
  passwordVisible.value = !passwordVisible.value
  inputRef.value?.focus()
}

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

onMounted(() => {
  if (props.modelValue != null && formItem) formItem.setValue(props.modelValue)
})

defineExpose({ focus, blur, input: inputRef })
</script>

<template>
  <div
    class="pt-input"
    :class="[
      `pt-input--${size}`,
      {
        'is-disabled': isDisabled,
        'is-focus': focused,
        'has-suffix': showClear || showPwd || $slots.suffix,
        'has-prefix': $slots.prefix
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <span v-if="$slots.prefix" class="pt-input__prefix">
      <slot name="prefix" />
    </span>
    <input
      :id="inputId"
      ref="inputRef"
      class="pt-input__inner"
      :type="nativeType"
      :value="text"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :minlength="minlength"
      :autocomplete="autocomplete"
      :name="name"
      :aria-label="ariaLabel"
      :aria-invalid="formItem?.error ? true : undefined"
      :aria-describedby="formItem?.error ? formItem.errorId : undefined"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span v-if="showClear || showPwd || $slots.suffix" class="pt-input__suffix">
      <button
        v-if="showClear"
        type="button"
        class="pt-input__icon-btn"
        aria-label="Clear"
        tabindex="-1"
        @click="clear"
      >
        <pt-icon :path="iconClear" />
      </button>
      <button
        v-if="showPwd"
        type="button"
        class="pt-input__icon-btn"
        :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
        :aria-pressed="passwordVisible"
        tabindex="-1"
        @click="togglePassword"
      >
        <pt-icon :path="passwordVisible ? iconEyeOff : iconEye" />
      </button>
      <slot name="suffix" />
    </span>
  </div>
</template>
