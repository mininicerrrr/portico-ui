<script setup lang="ts">
import { computed, inject } from 'vue'
import { menuContextKey } from './tokens'

export interface MenuItemProps {
  index: string
  disabled?: boolean
}

defineOptions({ name: 'PtMenuItem' })

const props = defineProps<MenuItemProps>()
const menu = inject(menuContextKey, undefined)
const isActive = computed(() => menu?.active === props.index)

function onClick() {
  if (props.disabled) return
  menu?.select(props.index)
}
</script>

<template>
  <div
    class="pt-menu-item"
    :class="{ 'is-active': isActive, 'is-disabled': disabled }"
    role="menuitem"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    @click="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
    <span v-if="$slots.icon" class="pt-menu-item__icon"><slot name="icon" /></span>
    <span class="pt-menu-item__content"><slot /></span>
  </div>
</template>
