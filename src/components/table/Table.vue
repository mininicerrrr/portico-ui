<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import { useLocale } from '../../locale'
import PtSpinner from '../icons/PtSpinner.vue'
import PtIcon from '../icons/PtIcon.vue'
import { iconChevron, iconChevronUp } from '../icons/icons'

export type TableSortOrder = 'asc' | 'desc' | null

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  formatter?: (row: Record<string, unknown>, column: TableColumn, cellValue: unknown, index: number) => string | number
  slot?: string
  sortable?: boolean | 'custom'
  sortMethod?: (a: Record<string, unknown>, b: Record<string, unknown>) => number
}

export interface TableProps {
  columns: TableColumn[]
  data?: Record<string, unknown>[]
  stripe?: boolean
  border?: boolean
  emptyText?: string
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string)
  maxHeight?: string | number
  loading?: boolean
  highlightCurrentRow?: boolean
  virtual?: boolean
  rowHeight?: number
}

defineOptions({ name: 'PtTable' })

const props = withDefaults(defineProps<TableProps>(), {
  data: () => [],
  rowKey: 'id',
  rowHeight: 41
})

const emit = defineEmits<{
  'sort-change': [payload: { prop: string; order: TableSortOrder }]
  'current-change': [row: Record<string, unknown> | null]
}>()

const { t } = useLocale()
const slots = useSlots()
const bodyRef = ref<HTMLElement>()
const scrollTop = ref(0)
const sortProp = ref<string | null>(null)
const sortOrder = ref<TableSortOrder>(null)
const currentKey = ref<string | null>(null)

const emptyLabel = computed(() => props.emptyText ?? t('table.emptyText'))
const skeletonRowCount = 5
const skeletonBars = ['92%', '68%', '54%', '76%', '40%']
const isEmpty = computed(() => !props.data.length && !props.loading)
const maxHeightStyle = computed(() => {
  if (props.maxHeight == null && !props.virtual) return undefined
  const raw = props.maxHeight ?? 400
  const value = typeof raw === 'number' ? `${raw}px` : raw
  return { maxHeight: value }
})

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

const sortedData = computed(() => {
  const list = props.data
  const prop = sortProp.value
  const order = sortOrder.value
  if (!prop || !order) return list
  const column = props.columns.find((item) => item.prop === prop)
  if (!column || column.sortable === 'custom') return list
  const copy = list.slice()
  copy.sort((a, b) => {
    const result = column.sortMethod ? column.sortMethod(a, b) : compareValues(a[prop], b[prop])
    return order === 'asc' ? result : -result
  })
  return copy
})

const useVirtual = computed(() => Boolean(props.virtual))
const overscan = 6
const viewportHeight = computed(() => {
  const raw = props.maxHeight ?? 400
  if (typeof raw === 'number') return raw
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : 400
})
const startIndex = computed(() => {
  if (!useVirtual.value) return 0
  return Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - overscan)
})
const endIndex = computed(() => {
  if (!useVirtual.value) return sortedData.value.length
  const visible = Math.ceil(viewportHeight.value / props.rowHeight) + overscan * 2
  return Math.min(sortedData.value.length, startIndex.value + visible)
})
const visibleRows = computed(() => {
  if (!useVirtual.value) return sortedData.value.map((row, index) => ({ row, index }))
  return sortedData.value.slice(startIndex.value, endIndex.value).map((row, offset) => ({
    row,
    index: startIndex.value + offset
  }))
})
const topSpacer = computed(() => (useVirtual.value ? startIndex.value * props.rowHeight : 0))
const bottomSpacer = computed(() =>
  useVirtual.value ? Math.max(0, (sortedData.value.length - endIndex.value) * props.rowHeight) : 0
)

function rowId(row: Record<string, unknown>, index: number): string {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  const key = row[props.rowKey]
  return key == null ? String(index) : String(key)
}

function widthStyle(column: TableColumn) {
  const style: Record<string, string> = {}
  if (column.width != null) style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  if (column.minWidth != null) style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth
  if (column.align) style.textAlign = column.align
  return style
}

function cellValue(row: Record<string, unknown>, column: TableColumn, index: number) {
  const value = row[column.prop]
  return column.formatter ? column.formatter(row, column, value, index) : value
}

function hasSlot(name?: string) {
  return Boolean(name && slots[name])
}

function toggleSort(column: TableColumn) {
  if (!column.sortable) return
  if (sortProp.value !== column.prop) {
    sortProp.value = column.prop
    sortOrder.value = 'asc'
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
  } else {
    sortProp.value = null
    sortOrder.value = null
  }
  emit('sort-change', { prop: column.prop, order: sortOrder.value })
}

function onRowClick(row: Record<string, unknown>, index: number) {
  if (!props.highlightCurrentRow) return
  const key = rowId(row, index)
  currentKey.value = currentKey.value === key ? null : key
  const current = currentKey.value ? row : null
  emit('current-change', current)
}

function onScroll(event: Event) {
  if (!useVirtual.value) return
  scrollTop.value = (event.target as HTMLElement).scrollTop
}

watch(
  () => props.data,
  () => {
    scrollTop.value = 0
    if (bodyRef.value) bodyRef.value.scrollTop = 0
  }
)
</script>

<template>
  <div
    class="pt-table"
    :class="{ 'is-border': border, 'is-stripe': stripe, 'is-loading': loading, 'is-virtual': virtual }"
  >
    <div
      ref="bodyRef"
      class="pt-table__wrap"
      :style="maxHeightStyle"
      @scroll="onScroll"
    >
      <table class="pt-table__table">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.prop"
              scope="col"
              :style="widthStyle(column)"
              :class="{ 'is-sortable': column.sortable, [`is-sort-${sortOrder}`]: sortProp === column.prop && sortOrder }"
              :aria-sort="sortProp === column.prop ? (sortOrder === 'asc' ? 'ascending' : sortOrder === 'desc' ? 'descending' : undefined) : undefined"
              @click="toggleSort(column)"
            >
              <span class="pt-table__th">
                {{ column.label }}
                <span v-if="column.sortable" class="pt-table__sort" aria-hidden="true">
                  <pt-icon :path="iconChevronUp" :class="{ 'is-active': sortProp === column.prop && sortOrder === 'asc' }" />
                  <pt-icon :path="iconChevron" :class="{ 'is-active': sortProp === column.prop && sortOrder === 'desc' }" />
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody v-if="loading" class="pt-table__body--loading">
          <tr
            v-for="rowIndex in skeletonRowCount"
            :key="`skeleton-${rowIndex}`"
            class="pt-table__skeleton-row"
            aria-hidden="true"
          >
            <td v-for="(column, columnIndex) in columns" :key="column.prop" :style="widthStyle(column)">
              <span
                class="pt-table__skeleton-cell"
                :style="{ width: skeletonBars[(rowIndex + columnIndex) % skeletonBars.length] }"
              />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-if="virtual && topSpacer" class="pt-table__spacer" aria-hidden="true">
            <td :colspan="columns.length" :style="{ height: `${topSpacer}px`, padding: 0, border: 0 }" />
          </tr>
          <tr
            v-for="entry in visibleRows"
            :key="rowId(entry.row, entry.index)"
            :class="{ 'is-current': highlightCurrentRow && currentKey === rowId(entry.row, entry.index) }"
            @click="onRowClick(entry.row, entry.index)"
          >
            <td v-for="column in columns" :key="column.prop" :style="widthStyle(column)">
              <slot v-if="hasSlot(column.slot)" :name="column.slot" :row="entry.row" :column="column" :index="entry.index" :value="entry.row[column.prop]" />
              <slot v-else-if="$slots.cell" name="cell" :row="entry.row" :column="column" :index="entry.index" :value="entry.row[column.prop]" />
              <template v-else>{{ cellValue(entry.row, column, entry.index) }}</template>
            </td>
          </tr>
          <tr v-if="virtual && bottomSpacer" class="pt-table__spacer" aria-hidden="true">
            <td :colspan="columns.length" :style="{ height: `${bottomSpacer}px`, padding: 0, border: 0 }" />
          </tr>
          <tr v-if="isEmpty">
            <td :colspan="columns.length" class="pt-table__empty">
              <slot name="empty">{{ emptyLabel }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="loading" class="pt-table__loading-status" role="status" :aria-label="t('table.loadingText')">
        <pt-spinner />
        <span>{{ t('table.loadingText') }}</span>
      </div>
    </div>
  </div>
</template>
