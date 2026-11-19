<script setup lang="ts">
import { inject } from 'vue'
import { dropdownContextKey } from './tokens'

export interface DropdownItemProps {
  command?: string | number | object
  disabled?: boolean
  divided?: boolean
}

defineOptions({ name: 'PtDropdownItem' })

const props = defineProps<DropdownItemProps>()
const dropdown = inject(dropdownContextKey, undefined)

function onClick() {
  if (props.disabled) return
  dropdown?.handleCommand(props.command ?? '')
}
</script>

<template>
  <div v-if="divided" class="pt-dropdown__divider" role="separator" />
  <div
    class="pt-dropdown__item"
    :class="{ 'is-disabled': disabled }"
    role="menuitem"
    :aria-disabled="disabled || undefined"
    @click="onClick"
  >
    <slot />
  </div>
</template>
