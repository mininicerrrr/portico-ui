<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { tabsContextKey } from './tokens'

export interface TabPaneProps {
  label?: string
  name: string | number
  disabled?: boolean
}

defineOptions({ name: 'PtTabPane' })

const props = defineProps<TabPaneProps>()
const tabs = inject(tabsContextKey, undefined)
const isActive = computed(() => tabs?.active === props.name)

function sync() {
  tabs?.register({ name: props.name, label: props.label, disabled: props.disabled })
}

onMounted(sync)
watch(() => [props.name, props.label, props.disabled], sync)
onBeforeUnmount(() => tabs?.unregister(props.name))
</script>

<template>
  <div v-show="isActive" class="pt-tab-pane" role="tabpanel">
    <slot />
  </div>
</template>
