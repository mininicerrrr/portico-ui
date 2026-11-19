<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { placementStyle, type PtPlacement } from '../../utils/placement'
import { dropdownContextKey } from './tokens'

export interface DropdownProps {
  trigger?: 'hover' | 'click'
  placement?: PtPlacement
  disabled?: boolean
}

defineOptions({ name: 'PtDropdown' })

const props = withDefaults(defineProps<DropdownProps>(), {
  trigger: 'hover',
  placement: 'bottom-start'
})

const emit = defineEmits<{
  command: [command: string | number | object]
  visibleChange: [visible: boolean]
}>()

const visible = ref(false)
const rootRef = ref<HTMLElement>()
const panelStyle = computed(() => placementStyle(props.placement, 6))
let hideTimer: number | undefined

function open() {
  if (props.disabled) return
  visible.value = true
  emit('visibleChange', true)
}

function close() {
  if (hideTimer) window.clearTimeout(hideTimer)
  hideTimer = undefined
  if (!visible.value) return
  visible.value = false
  emit('visibleChange', false)
}

function scheduleClose() {
  if (props.trigger !== 'hover') return
  hideTimer = window.setTimeout(close, 120)
}

function cancelClose() {
  if (hideTimer) window.clearTimeout(hideTimer)
  hideTimer = undefined
}

function toggle() {
  if (visible.value) close()
  else open()
}

function handleCommand(command: string | number | object) {
  emit('command', command)
  close()
}

function onDoc(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) close()
}

provide(dropdownContextKey, { handleCommand, close })
onMounted(() => document.addEventListener('mousedown', onDoc))
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDoc)
  if (hideTimer) window.clearTimeout(hideTimer)
})
</script>

<template>
  <span
    ref="rootRef"
    class="pt-dropdown"
    :class="{ 'is-disabled': disabled, 'is-opened': visible }"
    @mouseenter="trigger === 'hover' ? (cancelClose(), open()) : undefined"
    @mouseleave="scheduleClose"
  >
    <span class="pt-dropdown__trigger" @click="trigger === 'click' ? toggle() : undefined">
      <slot />
    </span>
    <div v-show="visible" class="pt-dropdown__menu" :style="panelStyle" role="menu" @mouseenter="cancelClose">
      <slot name="dropdown" />
    </div>
  </span>
</template>
