<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { placementFixedStyle, type PtPlacement } from '../../utils/placement'

export type TooltipEffect = 'dark' | 'light'
export type TooltipTrigger = 'hover' | 'click' | 'focus'

export interface TooltipProps {
  content?: string
  placement?: PtPlacement
  effect?: TooltipEffect
  disabled?: boolean
  showAfter?: number
  hideAfter?: number
  /** @deprecated Prefer `triggers` */
  trigger?: TooltipTrigger
  /** Show/hide via these interactions; default `['hover']` (or legacy `trigger`). */
  triggers?: TooltipTrigger[]
}

defineOptions({ name: 'PtTooltip' })

const tooltipSeqState = globalThis as typeof globalThis & { __ptTooltipSeq?: number }

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  effect: 'dark',
  showAfter: 80,
  hideAfter: 80,
  trigger: 'hover'
})

const instanceKey = (tooltipSeqState.__ptTooltipSeq = (tooltipSeqState.__ptTooltipSeq ?? 0) + 1)
const panelDomId = computed(() => `pt-tooltip-panel-${instanceKey}`)

const triggerRef = ref<HTMLElement>()
const visible = ref(false)
const panelStyle = ref<Record<string, string>>({})
let showTimer: number | undefined
let hideTimer: number | undefined

const activeTriggers = computed<TooltipTrigger[]>(() => {
  if (props.triggers?.length) return props.triggers
  return [props.trigger]
})

const panelClass = computed(() => `pt-tooltip__panel pt-tooltip__panel--${props.effect}`)

const describedBy = computed(() => (visible.value && !props.disabled ? panelDomId.value : undefined))

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

function hideImmediate() {
  clearTimers()
  visible.value = false
}

function toggle() {
  if (visible.value) hide()
  else show()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && visible.value) {
    event.stopPropagation()
    hideImmediate()
  }
}

function onMouseEnter() {
  if (activeTriggers.value.includes('hover')) show()
}

function onMouseLeave() {
  if (activeTriggers.value.includes('hover')) hide()
}

function onFocusIn() {
  if (activeTriggers.value.includes('focus')) show()
}

function onFocusOut(event: FocusEvent) {
  if (!activeTriggers.value.includes('focus')) return
  const next = event.relatedTarget as Node | null
  const root = triggerRef.value
  if (root && next && root.contains(next)) return
  hide()
}

function onClick() {
  if (activeTriggers.value.includes('click')) toggle()
}

watch(visible, (v) => {
  if (v) nextTick(syncPanelPosition)
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  clearTimers()
  window.removeEventListener('keydown', onKeydown)
})

defineExpose({ show, hide, hideImmediate, panelId: panelDomId })
</script>

<template>
  <span
    ref="triggerRef"
    class="pt-tooltip"
    :aria-describedby="describedBy"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @click="onClick"
  >
    <slot />
    <Teleport to="body">
      <span
        v-show="visible && !disabled"
        :id="panelDomId"
        :class="panelClass"
        :style="panelStyle"
        role="tooltip"
      >
        <slot name="content">{{ content }}</slot>
      </span>
    </Teleport>
  </span>
</template>