<script setup lang="ts">
export type SkeletonVariant = 'text' | 'card' | 'table'

export interface SkeletonProps {
  rows?: number
  animated?: boolean
  variant?: SkeletonVariant
}

defineOptions({ name: 'PtSkeleton' })

withDefaults(defineProps<SkeletonProps>(), {
  rows: 3,
  animated: true,
  variant: 'text'
})
</script>

<template>
  <div class="pt-skeleton" :class="[`pt-skeleton--${variant}`, { 'is-animated': animated }]" aria-hidden="true">
    <template v-if="variant === 'card'">
      <div class="pt-skeleton__block is-media" />
      <div class="pt-skeleton__block" v-for="n in rows" :key="n" :style="{ width: n === rows ? '62%' : '100%' }" />
    </template>
    <template v-else-if="variant === 'table'">
      <div class="pt-skeleton__row is-head">
        <div class="pt-skeleton__block" v-for="n in 4" :key="'h' + n" />
      </div>
      <div class="pt-skeleton__row" v-for="r in rows" :key="r">
        <div class="pt-skeleton__block" v-for="n in 4" :key="n" />
      </div>
    </template>
    <template v-else>
      <div class="pt-skeleton__block" v-for="n in rows" :key="n" :style="{ width: n === rows ? '68%' : '100%' }" />
    </template>
  </div>
</template>
