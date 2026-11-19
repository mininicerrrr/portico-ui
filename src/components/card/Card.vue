<script setup lang="ts">
export type CardShadow = 'always' | 'hover' | 'never'

export interface CardProps {
  header?: string
  shadow?: CardShadow
  bodyStyle?: Record<string, string> | string
}

defineOptions({ name: 'PtCard' })

withDefaults(defineProps<CardProps>(), {
  shadow: 'always'
})
</script>

<template>
  <div class="pt-card" :class="`pt-card--shadow-${shadow}`">
    <div v-if="header || $slots.header" class="pt-card__header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="pt-card__body" :style="bodyStyle">
      <slot />
    </div>
    <div v-if="$slots.footer" class="pt-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
