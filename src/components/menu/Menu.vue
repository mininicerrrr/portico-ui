<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { menuContextKey } from './tokens'

export type MenuMode = 'vertical' | 'horizontal'

export interface MenuProps {
  mode?: MenuMode
  collapse?: boolean
  defaultActive?: string
  router?: boolean
}

defineOptions({ name: 'PtMenu' })

const props = withDefaults(defineProps<MenuProps>(), {
  mode: 'vertical',
  collapse: false
})

const emit = defineEmits<{
  select: [index: string]
}>()

const active = ref(props.defaultActive ?? '')
watch(
  () => props.defaultActive,
  (value) => {
    if (value != null) active.value = value
  }
)

function select(index: string) {
  active.value = index
  emit('select', index)
  if (props.router && typeof window !== 'undefined' && index) {
    // Optional history hint; host apps can listen to select and route themselves.
  }
}

provide(menuContextKey, {
  get mode() {
    return props.mode
  },
  get collapse() {
    return props.collapse
  },
  get active() {
    return active.value
  },
  get router() {
    return props.router
  },
  select
})

const style = computed(() => {
  if (props.mode !== 'vertical') return undefined
  return { width: props.collapse ? '56px' : 'var(--pt-sidebar-width)' }
})
</script>

<template>
  <nav
    class="pt-menu"
    :class="[`pt-menu--${mode}`, { 'is-collapse': collapse }]"
    :style="style"
    role="menu"
  >
    <slot />
  </nav>
</template>
