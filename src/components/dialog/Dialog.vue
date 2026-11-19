<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { lockBodyScroll } from '../../utils/dom'
import { trapFocus, getFocusable } from '../../utils/focus-trap'
import { ptId } from '../../utils/id'
import { useLocale } from '../../locale'
import PtIcon from '../icons/PtIcon.vue'
import { iconClose } from '../icons/icons'

export type DialogSize = 'small' | 'default' | 'large'

export interface DialogProps {
  modelValue?: boolean
  title?: string
  width?: string
  size?: DialogSize
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  destroyOnClose?: boolean
  appendToBody?: boolean
}

const SIZE_WIDTH: Record<DialogSize, string> = {
  small: '360px',
  default: '480px',
  large: '640px'
}

defineOptions({ name: 'PtDialog' })

const props = withDefaults(defineProps<DialogProps>(), {
  size: 'default',
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
const titleId = ptId('pt-dialog-title')
let releaseFocus: (() => void) | undefined
let releaseScroll: (() => void) | undefined
let lastFocus: HTMLElement | null = null

const panelWidth = computed(() => props.width || SIZE_WIDTH[props.size])

function close() {
  if (!props.modelValue) return
  emit('update:modelValue', false)
  emit('close')
}

function onOverlay() {
  if (props.closeOnClickModal) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnPressEscape) {
    event.stopPropagation()
    close()
  }
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
      if (props.destroyOnClose) rendered.value = false
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
      class="pt-dialog"
      :class="{ 'is-visible': visible }"
      @keydown="onKeydown"
    >
      <div class="pt-dialog__overlay" @click="onOverlay" />
      <div
        ref="panelRef"
        class="pt-dialog__panel"
        :class="`pt-dialog__panel--${size}`"
        :style="{ width: panelWidth }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title || $slots.header ? titleId : undefined"
        tabindex="-1"
      >
        <header class="pt-dialog__header" :id="!title && $slots.header ? titleId : undefined">
          <slot name="header">
            <h2 :id="titleId" class="pt-dialog__title">{{ title }}</h2>
          </slot>
          <button
            v-if="showClose"
            type="button"
            class="pt-dialog__close"
            :aria-label="t('dialog.close')"
            @click="close"
          >
            <pt-icon :path="iconClose" />
          </button>
        </header>
        <div class="pt-dialog__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="pt-dialog__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>
