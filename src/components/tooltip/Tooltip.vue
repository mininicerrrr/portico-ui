<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { placementFixedStyle, type PtPlacement } from '../../utils/placement'

export type TooltipEffect = 'dark' | 'light'

export interface TooltipProps {
  content?: string
  placement?: PtPlacement
  effect?: TooltipEffect
  disabled?: boolean
  showAfter?: number
  hideAfter?: number
  trigger?: 'hover' | 'click' | 'focus'
}

defineOptions({ name: 'PtTooltip' })

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  effect: 'dark',
  showAfter: 80,
  hideAfter: 80,
  trigger: 'hover'
})

const triggerRef = ref<HTMLElement>()
const visible = ref(false)
const panelStyle = ref<Record<string, string>>({})
let showTimer: number | undefined
let hideTimer: number | undefined

const panelClass = computed(() => `pt-tooltip__panel pt-tooltip__panel--${props.effect}`)

function clearTimers() {
  if (showTimer) window.clearTimeout(showTimer)
  if (hideTimer) window.clearTimeout(hideTimer)
  showTimer = undefined
  hideTimer = undefined
}

function syncPanelPosition() {
  const el = triggerRef.value
  if (!el) return
  panelStyle.value = placementFixedStyle(el.getBoundingClientRect(), props.placement)
}

function show() {
  if (props.disabled) return
  clearTimers()
  showTimer = window.setTimeout(() => {
    visible.value = true
    nextTick(syncPanelPosition)
  }, props.showAfter)
}

function hide() {
  clearTimers()
  hideTimer = window.setTimeout(() => {
    visible.value = false
  }, props.hideAfter)
}

function toggle() {
  if (visible.value) hide()
  else show()
}

watch(visible, (v) => {
  if (v) nextTick(syncPanelPosition)
})

onBeforeUnmount(clearTimers)

defineExpose({ show, hide })
</script>

<template>
  <span
    ref="triggerRef"
    class="pt-tooltip"
    @mouseenter="trigger === 'hover' ? show() : undefined"
    @mouseleave="trigger === 'hover' ? hide() : undefined"
    @focusin="trigger !== 'click' ? show() : undefined"
    @focusout="trigger !== 'click' ? hide() : undefined"
    @click="trigger === 'click' ? toggle() : undefined"
  >
    <slot />
    <Teleport to="body">
      <span
        v-show="visible && !disabled"
        :class="panelClass"
        :style="panelStyle"
        role="tooltip"
      >
        <slot name="content">{{ content }}</slot>
      </span>
    </Teleport>
  </span>
</template>