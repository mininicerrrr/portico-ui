<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { tabsContextKey, type TabPaneRegistered } from './tokens'

export type TabsType = 'line' | 'card'

export interface TabsProps {
  modelValue?: string | number
  type?: TabsType
}

defineOptions({ name: 'PtTabs' })

const props = withDefaults(defineProps<TabsProps>(), {
  type: 'line'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const panes = ref<TabPaneRegistered[]>([])
const active = computed(() => props.modelValue ?? panes.value[0]?.name)

function activate(name: string | number, disabled?: boolean) {
  if (disabled) return
  emit('update:modelValue', name)
  emit('change', name)
}

provide(tabsContextKey, {
  get active() {
    return active.value
  },
  register(pane) {
    if (panes.value.some((item) => item.name === pane.name)) {
      panes.value = panes.value.map((item) => (item.name === pane.name ? pane : item))
      return
    }
    panes.value = [...panes.value, pane]
  },
  unregister(name) {
    panes.value = panes.value.filter((item) => item.name !== name)
  }
})
</script>

<template>
  <div class="pt-tabs" :class="`pt-tabs--${type}`">
    <div class="pt-tabs__nav" role="tablist">
      <button
        v-for="pane in panes"
        :key="String(pane.name)"
        type="button"
        class="pt-tabs__item"
        :class="{ 'is-active': pane.name === active, 'is-disabled': pane.disabled }"
        role="tab"
        :aria-selected="pane.name === active"
        :disabled="pane.disabled"
        @click="activate(pane.name, pane.disabled)"
      >
        {{ pane.label ?? pane.name }}
      </button>
    </div>
    <div class="pt-tabs__body">
      <slot />
    </div>
  </div>
</template>
