<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { lockBodyScroll } from '../../utils/dom'
import { trapFocus, getFocusable } from '../../utils/focus-trap'
import { ptId } from '../../utils/id'
import { useLocale } from '../../locale'
import PtIcon from '../icons/PtIcon.vue'
import { iconClose } from '../icons/icons'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps {
  modelValue?: boolean
  title?: string
  placement?: DrawerPlacement
  size?: string | number
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  appendToBody?: boolean
}

defineOptions({ name: 'PtDrawer' })

const props = withDefaults(defineProps<DrawerProps>(), {
  placement: 'right',
  size: '360px',
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  appendToBody: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  opened: []
  close: []
  closed: []
}>()

const { t } = useLocale()
const visible = ref(false)
const rendered = ref(false)
const panelRef = ref<HTMLElement>()
const titleId = ptId('pt-drawer-title')
let releaseFocus: (() => void) | undefined
let releaseScroll: (() => void) | undefined
let lastFocus: HTMLElement | null = null

const panelStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  if (props.placement === 'left' || props.placement === 'right') return { width: size }
  return { height: size }
})

function close() {
  if (!props.modelValue) return
  emit('update:modelValue', false)
  emit('close')
}

function onOverlay() {
  if (props.closeOnClickModal) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !props.closeOnPressEscape || !props.modelValue) return
  if (event.defaultPrevented) return
  event.stopPropagation()
  close()
}

function teardown() {
  releaseFocus?.()
  releaseFocus = undefined
  releaseScroll?.()
  releaseScroll = undefined
  lastFocus?.focus?.()
  lastFocus = null
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      lastFocus = document.activeElement as HTMLElement | null
      rendered.value = true
      visible.value = true
      emit('open')
      releaseScroll = lockBodyScroll()
      await nextTick()
      const panel = panelRef.value
      if (panel) {
        releaseFocus = trapFocus(panel)
        const focusable = getFocusable(panel)
        ;(focusable[0] || panel).focus()
      }
      emit('opened')
    } else if (visible.value) {
      visible.value = false
      teardown()
      emit('closed')
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => teardown())
</script>

<template>
  <teleport to="body" :disabled="!appendToBody">
    <div
      v-if="rendered"
      class="pt-drawer"
      :class="[`pt-drawer--${placement}`, { 'is-visible': visible }]"
      @keydown="onKeydown"
    >
      <div class="pt-drawer__overlay" @click="onOverlay" />
      <div
        ref="panelRef"
        class="pt-drawer__panel"
        :style="panelStyle"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title || $slots.header ? titleId : undefined"
        tabindex="-1"
      >
        <header class="pt-drawer__header">
          <slot name="header">
            <h2 :id="titleId" class="pt-drawer__title">{{ title }}</h2>
          </slot>
          <button
            v-if="showClose"
            type="button"
            class="pt-drawer__close"
            :aria-label="t('drawer.close')"
            @click="close"
          >
            <pt-icon :path="iconClose" />
          </button>
        </header>
        <div class="pt-drawer__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="pt-drawer__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>
