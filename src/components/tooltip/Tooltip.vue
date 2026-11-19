<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { placementStyle, type PtPlacement } from '../../utils/placement'

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

const visible = ref(false)
let showTimer: number | undefined
let hideTimer: number | undefined

const panelStyle = computed(() => placementStyle(props.placement))

function clearTimers() {
  if (showTimer) window.clearTimeout(showTimer)
  if (hideTimer) window.clearTimeout(hideTimer)
  showTimer = undefined
  hideTimer = undefined
}

function show() {
  if (props.disabled) return
  clearTimers()
  showTimer = window.setTimeout(() => {
    visible.value = true
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

onBeforeUnmount(clearTimers)

defineExpose({ show, hide })
</script>

<template>
  <span
    class="pt-tooltip"
    @mouseenter="trigger === 'hover' ? show() : undefined"
    @mouseleave="trigger === 'hover' ? hide() : undefined"
    @focusin="trigger !== 'click' ? show() : undefined"
    @focusout="trigger !== 'click' ? hide() : undefined"
    @click="trigger === 'click' ? toggle() : undefined"
  >
    <slot />
    <span
      v-show="visible && !disabled"
      class="pt-tooltip__panel"
      :class="`pt-tooltip__panel--${effect}`"
      :style="panelStyle"
      role="tooltip"
    >
      <slot name="content">{{ content }}</slot>
    </span>
  </span>
</template>
