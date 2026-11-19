<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '../../locale'
import PtIcon from '../icons/PtIcon.vue'
import { iconChevronLeft, iconChevronRight } from '../icons/icons'

export type PaginationSize = 'large' | 'default' | 'small'
export type PaginationLayoutItem = 'total' | 'sizes' | 'prev' | 'pager' | 'next' | 'jumper'

export interface PaginationProps {
  currentPage?: number
  pageSize?: number
  total?: number
  pagerCount?: number
  layout?: string
  disabled?: boolean
  size?: PaginationSize
  background?: boolean
  pageSizes?: number[]
}

defineOptions({ name: 'PtPagination' })

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pagerCount: 7,
  layout: 'total, sizes, prev, pager, next, jumper',
  size: 'default',
  pageSizes: () => [10, 20, 50, 100]
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  change: [currentPage: number, pageSize: number]
}>()

const { t } = useLocale()
const jump = ref(String(props.currentPage))

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize) || 1))
const current = computed(() => Math.min(Math.max(1, props.currentPage), pageCount.value))
const parts = computed(() =>
  props.layout
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is PaginationLayoutItem =>
      ['total', 'sizes', 'prev', 'pager', 'next', 'jumper'].includes(item)
    )
)

const pagers = computed(() => {
  const count = Math.max(5, props.pagerCount | 0)
  const odd = count % 2 === 1 ? count : count + 1
  const half = Math.floor((odd - 2) / 2)
  const total = pageCount.value
  const page = current.value
  if (total <= odd) return Array.from({ length: total }, (_, i) => i + 1)
  const list: Array<number | 'left' | 'right'> = [1]
  let start = Math.max(2, page - half)
  let end = Math.min(total - 1, page + half)
  if (page <= half + 1) {
    start = 2
    end = odd - 2
  } else if (page >= total - half) {
    start = total - (odd - 3)
    end = total - 1
  }
  if (start > 2) list.push('left')
  else start = 2
  for (let i = start; i <= end; i += 1) list.push(i)
  if (end < total - 1) list.push('right')
  list.push(total)
  return list
})

watch(
  () => props.currentPage,
  (value) => {
    jump.value = String(value)
  }
)

function go(page: number) {
  if (props.disabled) return
  const next = Math.min(Math.max(1, Math.trunc(page)), pageCount.value)
  if (next === props.currentPage) return
  emit('update:currentPage', next)
  emit('change', next, props.pageSize)
}

function changeSize(event: Event) {
  if (props.disabled) return
  const size = Number((event.target as HTMLSelectElement).value)
  emit('update:pageSize', size)
  const nextPage = Math.min(props.currentPage, Math.max(1, Math.ceil(props.total / size) || 1))
  emit('update:currentPage', nextPage)
  emit('change', nextPage, size)
}

function onJump() {
  const value = Number(jump.value)
  if (Number.isNaN(value)) {
    jump.value = String(current.value)
    return
  }
  go(value)
}
</script>

<template>
  <div
    class="pt-pagination"
    :class="[`pt-pagination--${size}`, { 'is-background': background, 'is-disabled': disabled }]"
    role="navigation"
  >
    <template v-for="part in parts" :key="part">
      <span v-if="part === 'total'" class="pt-pagination__total">{{ t('pagination.total', { total }) }}</span>
      <label v-else-if="part === 'sizes'" class="pt-pagination__sizes">
        <select :value="pageSize" :disabled="disabled" @change="changeSize">
          <option v-for="item in pageSizes" :key="item" :value="item">{{ t('pagination.sizes', { n: item }) }}</option>
        </select>
      </label>
      <button
        v-else-if="part === 'prev'"
        type="button"
        class="pt-pagination__btn"
        :disabled="disabled || current <= 1"
        @click="go(current - 1)"
      >
        <pt-icon :path="iconChevronLeft" />
      </button>
      <ul v-else-if="part === 'pager'" class="pt-pagination__pager">
        <li v-for="item in pagers" :key="String(item)">
          <button
            v-if="item === 'left' || item === 'right'"
            type="button"
            class="pt-pagination__btn is-more"
            :disabled="disabled"
            @click="go(item === 'left' ? current - (pagerCount - 2) : current + (pagerCount - 2))"
          >
            …
          </button>
          <button
            v-else
            type="button"
            class="pt-pagination__btn"
            :class="{ 'is-active': item === current }"
            :disabled="disabled"
            @click="go(item)"
          >
            {{ item }}
          </button>
        </li>
      </ul>
      <button
        v-else-if="part === 'next'"
        type="button"
        class="pt-pagination__btn"
        :disabled="disabled || current >= pageCount"
        @click="go(current + 1)"
      >
        <pt-icon :path="iconChevronRight" />
      </button>
      <span v-else-if="part === 'jumper'" class="pt-pagination__jumper">
        {{ t('pagination.jumper') }}
        <input
          v-model="jump"
          :disabled="disabled"
          @keydown.enter="onJump"
          @blur="onJump"
        />
        {{ t('pagination.page') }}
      </span>
    </template>
  </div>
</template>
