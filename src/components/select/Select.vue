<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { formItemContextKey } from '../form/tokens'
import { useFormDisabled } from '../../utils/use-form-disabled'
import { ptId } from '../../utils/id'
import { useLocale } from '../../locale'
import PtIcon from '../icons/PtIcon.vue'
import PtSpinner from '../icons/PtSpinner.vue'
import { iconChevron, iconClear } from '../icons/icons'
import { selectContextKey, type SelectOptionData, type SelectValue } from './tokens'
import PtOption from './Option.vue'
import PtTag from '../tag/Tag.vue'

export type SelectSize = 'large' | 'default' | 'small'
export type { SelectValue }

export interface SelectProps {
  modelValue?: SelectValue
  options?: SelectOptionData[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: SelectSize
  id?: string
  name?: string
  ariaLabel?: string
  filterable?: boolean
  filterMethod?: (query: string, option: SelectOptionData) => boolean
  remote?: boolean
  remoteMethod?: (query: string) => void
  loading?: boolean
  loadingText?: string
  noMatchText?: string
  noDataText?: string
  multiple?: boolean
  collapseTags?: boolean
  multipleLimit?: number
}

defineOptions({ name: 'PtSelect' })

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
  clearable: true,
  multipleLimit: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue]
  change: [value: SelectValue]
  visibleChange: [visible: boolean]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const { t } = useLocale()
const formItem = inject(formItemContextKey, undefined)
const opened = ref(false)
const rootRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()
const filterRef = ref<HTMLInputElement>()
const listboxId = ptId('pt-listbox')
const slotted = ref<SelectOptionData[]>([])
const highlighted = ref<SelectOptionData['value'] | null>(null)
const query = ref('')
const hovering = ref(false)

const inputId = computed(() => props.id || formItem?.inputId)
const size = computed(() => props.size || formItem?.size || 'default')
const isDisabled = useFormDisabled(() => props.disabled)
const validateState = computed(() => formItem?.validateState || '')
const placeholderText = computed(() => props.placeholder ?? t('select.placeholder'))
const loadingLabel = computed(() => props.loadingText ?? t('select.loadingText'))
const noMatchLabel = computed(() => props.noMatchText ?? t('select.noMatchText'))
const noDataLabel = computed(() => props.noDataText ?? t('select.noDataText'))

const selectedValues = computed<(string | number | boolean)[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue == null || props.modelValue === '' ? [] : [props.modelValue as string | number | boolean]
})

const allOptions = computed(() => {
  const map = new Map<string, SelectOptionData>()
  for (const item of [...props.options, ...slotted.value]) {
    map.set(String(item.value), item)
  }
  return Array.from(map.values())
})

const filteredOptions = computed(() => {
  if (props.remote) return allOptions.value
  const q = query.value.trim()
  if (!props.filterable || !q) return allOptions.value
  if (props.filterMethod) return allOptions.value.filter((item) => props.filterMethod!(q, item))
  const lower = q.toLowerCase()
  return allOptions.value.filter((item) => item.label.toLowerCase().includes(lower))
})

const enabledOptions = computed(() => filteredOptions.value.filter((item) => !item.disabled))
const selectedOptions = computed(() =>
  selectedValues.value
    .map((value) => allOptions.value.find((item) => item.value === value))
    .filter((item): item is SelectOptionData => Boolean(item))
)
const displayLabel = computed(() => (props.multiple ? '' : selectedOptions.value[0]?.label ?? ''))
const hasValue = computed(() => selectedValues.value.length > 0)
const showClear = computed(
  () => props.clearable && !isDisabled.value && hasValue.value && (opened.value || hovering.value || true)
)
const visibleTags = computed(() => {
  if (!props.multiple) return []
  if (props.collapseTags && selectedOptions.value.length > 1) return selectedOptions.value.slice(0, 1)
  return selectedOptions.value
})
const hiddenTagCount = computed(() =>
  props.multiple && props.collapseTags ? Math.max(0, selectedOptions.value.length - 1) : 0
)
const panelEmptyText = computed(() => {
  if (props.loading) return loadingLabel.value
  if (allOptions.value.length === 0) return noDataLabel.value
  if (filteredOptions.value.length === 0) return noMatchLabel.value
  return ''
})
const atLimit = computed(
  () => props.multiple && props.multipleLimit > 0 && selectedValues.value.length >= props.multipleLimit
)
const activeDescendant = computed(() =>
  opened.value && highlighted.value != null ? optionId(highlighted.value) : undefined
)

function optionId(value: SelectOptionData['value']) {
  return `${listboxId}-opt-${String(value)}`
}

function isSelected(value: SelectOptionData['value']) {
  return selectedValues.value.includes(value)
}

function close() {
  if (!opened.value) return
  opened.value = false
  highlighted.value = null
  if (!props.remote) query.value = ''
  emit('visibleChange', false)
}

function syncHighlight() {
  const selected = enabledOptions.value.find((item) => isSelected(item.value))
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
  nextTick(() => filterRef.value?.focus())
}

function toggle() {
  if (isDisabled.value) return
  if (opened.value) close()
  else open()
}

function apply(value: SelectValue) {
  emit('update:modelValue', value)
  emit('change', value)
  formItem?.setValue(value)
  formItem?.validate('change')
}

function select(option: SelectOptionData) {
  if (option.disabled) return
  if (props.multiple) {
    const current = [...selectedValues.value]
    const index = current.indexOf(option.value)
    if (index >= 0) current.splice(index, 1)
    else {
      if (atLimit.value) return
      current.push(option.value)
    }
    apply(current)
    query.value = ''
    if (props.remote) props.remoteMethod?.(query.value)
    nextTick(() => {
      syncHighlight()
      filterRef.value?.focus()
    })
    return
  }
  apply(option.value)
  query.value = ''
  close()
  rootRef.value?.querySelector<HTMLElement>('.pt-select__control')?.focus()
}

function clear(event: Event) {
  event.stopPropagation()
  apply(props.multiple ? [] : null)
  query.value = ''
  close()
}

function removeTag(option: SelectOptionData, event: Event) {
  event.stopPropagation()
  if (isDisabled.value) return
  apply(selectedValues.value.filter((value) => value !== option.value))
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

function onFilterInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  if (!opened.value) open()
  if (props.remote) props.remoteMethod?.(query.value)
  nextTick(() => syncHighlight())
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
  } else if (event.key === 'Enter' || (event.key === ' ' && !props.filterable)) {
    event.preventDefault()
    if (!opened.value) open()
    else {
      const item = filteredOptions.value.find((option) => option.value === highlighted.value)
      if (item && !item.disabled) select(item)
      else if (!props.multiple) close()
    }
  } else if (event.key === 'Backspace' && props.multiple && props.filterable && !query.value && selectedValues.value.length) {
    apply(selectedValues.value.slice(0, -1))
  } else if (event.key === 'Escape') {
    if (opened.value) {
      event.preventDefault()
      close()
    }
  } else if (props.filterable && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    if (!opened.value) open()
  }
}

function onDocClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) close()
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  if (rootRef.value?.contains(event.relatedTarget as Node)) return
  emit('blur', event)
  formItem?.validate('blur')
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
  select,
  isSelected,
  isOptionVisible(value) {
    return filteredOptions.value.some((item) => item.value === value)
  }
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
    :class="[
      `pt-select--${size}`,
      {
        'is-opened': opened,
        'is-disabled': isDisabled,
        'is-multiple': multiple,
        'is-filterable': filterable,
        'is-error': validateState === 'error',
        'is-success': validateState === 'success'
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="multiple ? selectedValues.join(',') : modelValue == null ? '' : String(modelValue)"
    />
    <div
      :id="inputId"
      class="pt-select__control"
      role="combobox"
      :tabindex="isDisabled || filterable ? -1 : 0"
      :aria-disabled="isDisabled || undefined"
      :aria-label="ariaLabel"
      :aria-expanded="opened"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendant"
      :aria-invalid="validateState === 'error' ? true : undefined"
      :aria-describedby="validateState === 'error' ? formItem?.errorId : undefined"
      :aria-multiselectable="multiple || undefined"
      @click="toggle"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <div class="pt-select__tags" v-if="multiple && selectedOptions.length">
        <pt-tag
          v-for="item in visibleTags"
          :key="String(item.value)"
          size="small"
          closable
          @close="removeTag(item, $event)"
        >
          {{ item.label }}
        </pt-tag>
        <span v-if="hiddenTagCount" class="pt-select__count">+{{ hiddenTagCount }}</span>
      </div>
      <input
        v-if="filterable"
        ref="filterRef"
        class="pt-select__input"
        :value="query"
        :placeholder="hasValue && !(multiple && opened) && !query ? '' : (!hasValue || opened ? placeholderText : '')"
        :disabled="isDisabled"
        :tabindex="isDisabled ? -1 : 0"
        autocomplete="off"
        @input="onFilterInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        @click.stop="open"
      />
      <span v-else-if="displayLabel" class="pt-select__value">{{ displayLabel }}</span>
      <span v-else-if="!multiple || !selectedOptions.length" class="pt-select__placeholder">{{ placeholderText }}</span>
      <span class="pt-select__suffix">
        <button
          v-if="showClear"
          type="button"
          class="pt-input__icon-btn"
          data-pt="clear"
          :aria-label="t('select.clear')"
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
      <li v-if="loading" class="pt-select__empty pt-select__loading" role="status">
        <pt-spinner />
        <span>{{ loadingLabel }}</span>
      </li>
      <template v-else>
        <slot>
          <pt-option
            v-for="item in (filterable || remote ? filteredOptions : options)"
            :key="String(item.value)"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled || (atLimit && !isSelected(item.value))"
          />
        </slot>
        <li v-if="panelEmptyText && !loading && (filterable ? !filteredOptions.length : !allOptions.length || (query && !filteredOptions.length))" class="pt-select__empty">
          {{ panelEmptyText }}
        </li>
      </template>
    </ul>
  </div>
</template>
