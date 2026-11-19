<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { formItemContextKey } from '../form/tokens'
import { useFormDisabled } from '../../utils/use-form-disabled'
import { ptId } from '../../utils/id'
import PtIcon from '../icons/PtIcon.vue'
import { iconChevron, iconClear } from '../icons/icons'
import { selectContextKey, type SelectOptionData } from './tokens'
import PtOption from './Option.vue'

export type SelectSize = 'large' | 'default' | 'small'

export interface SelectProps {
  modelValue?: string | number | boolean | null
  options?: SelectOptionData[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: SelectSize
  id?: string
  name?: string
  ariaLabel?: string
}

defineOptions({ name: 'PtSelect' })

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Please select',
  options: () => [],
  clearable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | null]
  change: [value: string | number | boolean | null]
  visibleChange: [visible: boolean]
}>()

const formItem = inject(formItemContextKey, undefined)
const opened = ref(false)
const rootRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()
const listboxId = ptId('pt-listbox')
const slotted = ref<SelectOptionData[]>([])
const highlighted = ref<SelectOptionData['value'] | null>(null)

const inputId = computed(() => props.id || formItem?.inputId)
const size = computed(() => props.size || formItem?.size || 'default')
const isDisabled = useFormDisabled(() => props.disabled)
const allOptions = computed(() => {
  const map = new Map<string, SelectOptionData>()
  for (const item of [...props.options, ...slotted.value]) {
    map.set(String(item.value), item)
  }
  return Array.from(map.values())
})
const enabledOptions = computed(() => allOptions.value.filter((item) => !item.disabled))
const selectedOption = computed(() => allOptions.value.find((item) => item.value === props.modelValue))
const displayLabel = computed(() => selectedOption.value?.label ?? '')
const showClear = computed(
  () => props.clearable && !isDisabled.value && props.modelValue != null && props.modelValue !== ''
)
const activeDescendant = computed(() =>
  opened.value && highlighted.value != null ? optionId(highlighted.value) : undefined
)

function optionId(value: SelectOptionData['value']) {
  return `${listboxId}-opt-${String(value)}`
}

function close() {
  if (!opened.value) return
  opened.value = false
  highlighted.value = null
  emit('visibleChange', false)
}

function syncHighlight() {
  const selected = selectedOption.value
  const first = enabledOptions.value[0]
  highlighted.value = selected?.value ?? first?.value ?? null
  nextTick(() => {
    const active = listRef.value?.querySelector<HTMLElement>('.is-highlighted, .is-selected')
    active?.scrollIntoView?.({ block: 'nearest' })
  })
}

function open() {
  if (isDisabled.value || opened.value) return
  opened.value = true
  emit('visibleChange', true)
  syncHighlight()
}

function toggle() {
  if (isDisabled.value) return
  if (opened.value) close()
  else open()
}

function apply(value: string | number | boolean | null) {
  emit('update:modelValue', value)
  emit('change', value)
  formItem?.setValue(value)
  formItem?.validate('change')
}

function select(option: SelectOptionData) {
  if (option.disabled) return
  apply(option.value)
  close()
  rootRef.value?.querySelector<HTMLElement>('.pt-select__control')?.focus()
}

function clear(event: Event) {
  event.stopPropagation()
  apply(null)
  close()
}

function moveHighlight(delta: number) {
  const items = enabledOptions.value
  if (!items.length) return
  const index = items.findIndex((item) => item.value === highlighted.value)
  const nextIndex =
    index === -1 ? (delta > 0 ? 0 : items.length - 1) : (index + delta + items.length) % items.length
  highlighted.value = items[nextIndex].value
  nextTick(() => {
    listRef.value?.querySelector<HTMLElement>('.is-highlighted')?.scrollIntoView?.({ block: 'nearest' })
  })
}

function onKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!opened.value) {
      open()
      return
    }
    moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Home' && opened.value) {
    event.preventDefault()
    if (enabledOptions.value.length) highlighted.value = enabledOptions.value[0].value
  } else if (event.key === 'End' && opened.value) {
    event.preventDefault()
    const items = enabledOptions.value
    if (items.length) highlighted.value = items[items.length - 1].value
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!opened.value) open()
    else {
      const item = allOptions.value.find((option) => option.value === highlighted.value)
      if (item && !item.disabled) select(item)
      else close()
    }
  } else if (event.key === 'Escape') {
    if (opened.value) {
      event.preventDefault()
      close()
    }
  }
}

function onDocClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) close()
}

provide(selectContextKey, {
  get selected() {
    return props.modelValue
  },
  get highlighted() {
    return highlighted.value
  },
  optionId,
  register(option) {
    if (slotted.value.some((item) => item.value === option.value)) return
    slotted.value = [...slotted.value, option]
  },
  unregister(value) {
    slotted.value = slotted.value.filter((item) => item.value !== value)
  },
  select
})

onMounted(() => document.addEventListener('mousedown', onDocClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick))

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close()
  }
)
</script>

<template>
  <div
    ref="rootRef"
    class="pt-select"
    :class="[`pt-select--${size}`, { 'is-opened': opened, 'is-disabled': isDisabled }]"
  >
    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="modelValue == null ? '' : String(modelValue)"
    />
    <div
      :id="inputId"
      class="pt-select__control"
      role="combobox"
      :tabindex="isDisabled ? -1 : 0"
      :aria-disabled="isDisabled || undefined"
      :aria-label="ariaLabel"
      :aria-expanded="opened"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendant"
      :aria-invalid="formItem?.error ? true : undefined"
      :aria-describedby="formItem?.error ? formItem.errorId : undefined"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span v-if="displayLabel" class="pt-select__value">{{ displayLabel }}</span>
      <span v-else class="pt-select__placeholder">{{ placeholder }}</span>
      <span class="pt-select__suffix">
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
        <pt-icon class="pt-select__chevron" :path="iconChevron" />
      </span>
    </div>
    <ul
      v-show="opened"
      :id="listboxId"
      ref="listRef"
      class="pt-select__menu"
      role="listbox"
    >
      <slot>
        <pt-option
          v-for="item in options"
          :key="String(item.value)"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </slot>
      <li v-if="!allOptions.length" class="pt-select__empty">No data</li>
    </ul>
  </div>
</template>
