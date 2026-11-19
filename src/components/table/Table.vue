<script setup lang="ts">
import { computed, useSlots } from 'vue'

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  formatter?: (row: Record<string, unknown>, column: TableColumn, cellValue: unknown, index: number) => string | number
  slot?: string
}

export interface TableProps {
  columns: TableColumn[]
  data?: Record<string, unknown>[]
  stripe?: boolean
  border?: boolean
  emptyText?: string
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string)
  maxHeight?: string | number
}

defineOptions({ name: 'PtTable' })

const props = withDefaults(defineProps<TableProps>(), {
  data: () => [],
  emptyText: 'No data',
  rowKey: 'id'
})

const slots = useSlots()

const isEmpty = computed(() => !props.data.length)

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
</script>

<template>
  <div class="pt-table" :class="{ 'is-border': border, 'is-stripe': stripe }" :style="maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight, overflow: 'auto' } : undefined">
    <table class="pt-table__table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.prop" scope="col" :style="widthStyle(column)">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="rowId(row, index)">
          <td v-for="column in columns" :key="column.prop" :style="widthStyle(column)">
            <slot v-if="hasSlot(column.slot)" :name="column.slot" :row="row" :column="column" :index="index" :value="row[column.prop]" />
            <slot v-else-if="$slots.cell" name="cell" :row="row" :column="column" :index="index" :value="row[column.prop]" />
            <template v-else>{{ cellValue(row, column, index) }}</template>
          </td>
        </tr>
        <tr v-if="isEmpty">
          <td :colspan="columns.length" class="pt-table__empty">
            <slot name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
