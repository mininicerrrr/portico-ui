<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formItemContextKey } from '../form/tokens'
import { useFormDisabled } from '../../utils/use-form-disabled'
import { useLocale } from '../../locale'
import PtIcon from '../icons/PtIcon.vue'
import PtButton from '../button/Button.vue'
import { iconCalendar, iconChevronLeft, iconChevronRight, iconClear } from '../icons/icons'
import { buildMonthCells, formatDate, parseDate, sameDay, startOfDay } from './utils'

export type DatePickerType = 'date' | 'daterange'
export type DatePickerSize = 'large' | 'default' | 'small'
export type DatePickerValue = Date | string | [Date | string | null, Date | string | null] | null

export interface DatePickerProps {
  type?: DatePickerType
  modelValue?: DatePickerValue
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: DatePickerSize
  format?: string
  valueFormat?: string
  disabledDate?: (date: Date) => boolean
  id?: string
  name?: string
}

defineOptions({ name: 'PtDatePicker' })

const props = withDefaults(defineProps<DatePickerProps>(), {
  type: 'date',
  clearable: true,
  format: 'YYYY-MM-DD'
})

const emit = defineEmits<{
  'update:modelValue': [value: DatePickerValue]
  change: [value: DatePickerValue]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const formItem = inject(formItemContextKey, undefined)
const { t, locale } = useLocale()
const isDisabled = useFormDisabled(() => props.disabled)
const size = computed(() => props.size || formItem?.size || 'default')
const validateState = computed(() => formItem?.validateState || '')
const opened = ref(false)
const rootRef = ref<HTMLElement>()
const view = ref(startOfDay(new Date()))
const pickingEnd = ref(false)
const hoverDate = ref<Date | null>(null)

const isRange = computed(() => props.type === 'daterange')
const parsed = computed(() => {
  if (isRange.value) {
    const value = Array.isArray(props.modelValue) ? props.modelValue : [null, null]
    return [parseDate(value[0], props.valueFormat), parseDate(value[1], props.valueFormat)] as [Date | null, Date | null]
  }
  return [parseDate(props.modelValue as Date | string | null, props.valueFormat), null] as [Date | null, Date | null]
})

const displayStart = computed(() => formatDate(parsed.value[0], props.format))
const displayEnd = computed(() => formatDate(parsed.value[1], props.format))
const placeholderStart = computed(() =>
  isRange.value ? props.startPlaceholder ?? t('datePicker.startPlaceholder') : props.placeholder ?? t('datePicker.placeholder')
)
const placeholderEnd = computed(() => props.endPlaceholder ?? t('datePicker.endPlaceholder'))
const monthLabel = computed(() => {
  const year = view.value.getFullYear()
  const month = locale.value.datePicker.months[view.value.getMonth()]
  const yearText = t('datePicker.year')
  const monthText = t('datePicker.month')
  return yearText || monthText ? `${year}${yearText} ${month}${monthText}` : `${month} ${year}`
})
const weeks = computed(() => locale.value.datePicker.weeks)
const cells = computed(() => buildMonthCells(view.value.getFullYear(), view.value.getMonth()))
const showClear = computed(() => props.clearable && !isDisabled.value && Boolean(parsed.value[0] || parsed.value[1]))

function output(dates: [Date | null, Date | null]): DatePickerValue {
  const toValue = (date: Date | null) => {
    if (!date) return null
    return props.valueFormat ? formatDate(date, props.valueFormat) : date
  }
  if (isRange.value) return [toValue(dates[0]), toValue(dates[1])]
  return toValue(dates[0])
}

function apply(dates: [Date | null, Date | null]) {
  const value = output(dates)
  emit('update:modelValue', value)
  emit('change', value)
  formItem?.setValue(value)
  formItem?.validate('change')
}

function open() {
  if (isDisabled.value || opened.value) return
  opened.value = true
  view.value = startOfDay(parsed.value[0] ?? new Date())
  pickingEnd.value = false
}

function close() {
  opened.value = false
  pickingEnd.value = false
  hoverDate.value = null
}

function isDisabledCell(date: Date) {
  return props.disabledDate?.(date) ?? false
}

function inRange(date: Date) {
  const [start, end] = parsed.value
  const hover = hoverDate.value
  const finish = end ?? (pickingEnd.value ? hover : null)
  if (!start || !finish) return false
  const a = start.getTime()
  const b = finish.getTime()
  const t0 = Math.min(a, b)
  const t1 = Math.max(a, b)
  const time = date.getTime()
  return time >= t0 && time <= t1
}

function pick(date: Date) {
  if (isDisabledCell(date)) return
  if (!isRange.value) {
    apply([date, null])
    close()
    return
  }
  const [start] = parsed.value
  if (!pickingEnd.value || !start) {
    apply([date, null])
    pickingEnd.value = true
    return
  }
  const first = start.getTime() <= date.getTime() ? start : date
  const second = start.getTime() <= date.getTime() ? date : start
  apply([first, second])
  close()
}

function shiftMonth(delta: number) {
  const next = new Date(view.value)
  next.setMonth(next.getMonth() + delta)
  view.value = startOfDay(next)
}

function pickToday() {
  const today = startOfDay(new Date())
  if (isDisabledCell(today)) return
  if (isRange.value) apply([today, today])
  else apply([today, null])
  close()
}

function clear(event: Event) {
  event.stopPropagation()
  apply(isRange.value ? [null, null] : [null, null])
  close()
}

function onDoc(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) close()
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
  open()
}

function onBlur(event: FocusEvent) {
  if (rootRef.value?.contains(event.relatedTarget as Node)) return
  emit('blur', event)
  formItem?.validate('blur')
}

onMounted(() => document.addEventListener('mousedown', onDoc))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDoc))

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
    class="pt-date-picker"
    :class="[
      `pt-date-picker--${size}`,
      { 'is-opened': opened, 'is-disabled': isDisabled, 'is-range': isRange, 'is-error': validateState === 'error', 'is-success': validateState === 'success' }
    ]"
  >
    <div
      class="pt-date-picker__control"
      :tabindex="isDisabled ? -1 : 0"
      :id="id || formItem?.inputId"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.esc="close"
      @focus="onFocus"
      @blur="onBlur"
    >
      <pt-icon class="pt-date-picker__prefix" :path="iconCalendar" />
      <span v-if="displayStart" class="pt-date-picker__value">{{ displayStart }}</span>
      <span v-else class="pt-date-picker__placeholder">{{ placeholderStart }}</span>
      <template v-if="isRange">
        <span class="pt-date-picker__sep">–</span>
        <span v-if="displayEnd" class="pt-date-picker__value">{{ displayEnd }}</span>
        <span v-else class="pt-date-picker__placeholder">{{ placeholderEnd }}</span>
      </template>
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
    </div>
    <div v-show="opened" class="pt-picker__panel" role="dialog">
      <div class="pt-picker__header">
        <button type="button" class="pt-picker__nav" @click="shiftMonth(-1)">
          <pt-icon :path="iconChevronLeft" />
        </button>
        <span class="pt-picker__month">{{ monthLabel }}</span>
        <button type="button" class="pt-picker__nav" @click="shiftMonth(1)">
          <pt-icon :path="iconChevronRight" />
        </button>
      </div>
      <div class="pt-picker__weeks">
        <span v-for="week in weeks" :key="week">{{ week }}</span>
      </div>
      <div class="pt-picker__grid">
        <button
          v-for="cell in cells"
          :key="cell.toISOString()"
          type="button"
          class="pt-picker__cell"
          :class="{
            'is-other': cell.getMonth() !== view.getMonth(),
            'is-today': sameDay(cell, new Date()),
            'is-selected': sameDay(cell, parsed[0]) || sameDay(cell, parsed[1]),
            'is-in-range': isRange && inRange(cell),
            'is-disabled': isDisabledCell(cell)
          }"
          :disabled="isDisabledCell(cell)"
          @click="pick(cell)"
          @mouseenter="hoverDate = cell"
        >
          {{ cell.getDate() }}
        </button>
      </div>
      <div class="pt-picker__footer">
        <pt-button text size="small" @click="pickToday">{{ t('datePicker.today') }}</pt-button>
      </div>
    </div>
  </div>
</template>
