<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { menuContextKey } from './tokens'
import PtIcon from '../icons/PtIcon.vue'
import { iconChevron } from '../icons/icons'

export interface SubMenuProps {
  index: string
  disabled?: boolean
}

defineOptions({ name: 'PtSubMenu' })

const props = defineProps<SubMenuProps>()
const menu = inject(menuContextKey, undefined)
const opened = ref(false)
const isActive = computed(() => menu?.active?.startsWith(props.index))

function toggle() {
  if (props.disabled || menu?.collapse) return
  opened.value = !opened.value
}
</script>

<template>
  <div class="pt-sub-menu" :class="{ 'is-opened': opened, 'is-active': isActive, 'is-disabled': disabled }">
    <div
      class="pt-sub-menu__title"
      role="menuitem"
      :aria-expanded="opened"
      :tabindex="disabled ? -1 : 0"
      @click="toggle"
      @keydown.enter.prevent="toggle"
    >
      <span v-if="$slots.icon" class="pt-menu-item__icon"><slot name="icon" /></span>
      <span class="pt-menu-item__content"><slot name="title" /></span>
      <pt-icon class="pt-sub-menu__arrow" :path="iconChevron" />
    </div>
    <div v-show="opened && !menu?.collapse" class="pt-sub-menu__list" role="menu">
      <slot />
    </div>
  </div>
</template>
