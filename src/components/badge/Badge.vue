<script setup lang="ts">
import { computed } from 'vue'

export type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  value?: string | number
  max?: number
  isDot?: boolean
  type?: BadgeType
  hidden?: boolean
}

defineOptions({ name: 'PtBadge' })

const props = withDefaults(defineProps<BadgeProps>(), {
  max: 99,
  type: 'danger'
})

const display = computed(() => {
  if (props.isDot) return ''
  if (typeof props.value === 'number' && props.value > props.max) return `${props.max}+`
  return props.value ?? ''
})
const show = computed(() => !props.hidden && (props.isDot || display.value !== '' && display.value != null))
</script>

<template>
  <span class="pt-badge">
    <slot />
    <sup
      v-if="show"
      class="pt-badge__content"
      :class="[`pt-badge--${type}`, { 'is-dot': isDot, 'is-standalone': !$slots.default }]"
    >
      {{ display }}
    </sup>
  </span>
</template>
