<script setup lang="ts">
export interface DividerProps {
  direction?: 'horizontal' | 'vertical'
  contentPosition?: 'left' | 'center' | 'right'
}

defineOptions({ name: 'PtDivider' })

withDefaults(defineProps<DividerProps>(), {
  direction: 'horizontal',
  contentPosition: 'center'
})
</script>

<template>
  <div
    class="pt-divider"
    :class="[`pt-divider--${direction}`, direction === 'horizontal' ? `pt-divider--${contentPosition}` : '']"
    role="separator"
    :aria-orientation="direction"
  >
    <span v-if="direction === 'horizontal' && $slots.default" class="pt-divider__text">
      <slot />
    </span>
  </div>
</template>
