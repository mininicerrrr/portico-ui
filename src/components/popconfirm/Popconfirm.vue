<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from '../../locale'
import PtButton from '../button/Button.vue'
import PtIcon from '../icons/PtIcon.vue'
import { iconWarning } from '../icons/icons'
import { placementStyle, type PtPlacement } from '../../utils/placement'

export interface PopconfirmProps {
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  placement?: PtPlacement
  disabled?: boolean
}

defineOptions({ name: 'PtPopconfirm' })

const props = withDefaults(defineProps<PopconfirmProps>(), {
  placement: 'top'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { t } = useLocale()
const visible = ref(false)
const confirmText = computed(() => props.confirmButtonText ?? t('popconfirm.confirm'))
const cancelText = computed(() => props.cancelButtonText ?? t('popconfirm.cancel'))
const panelStyle = computed(() => placementStyle(props.placement, 10))

function open() {
  if (props.disabled) return
  visible.value = true
}

function close() {
  visible.value = false
}

function onConfirm() {
  emit('confirm')
  close()
}

function onCancel() {
  emit('cancel')
  close()
}

const rootRef = ref<HTMLElement>()

function onDoc(event: MouseEvent) {
  if (!visible.value) return
  if (!rootRef.value?.contains(event.target as Node)) close()
}

onMounted(() => document.addEventListener('mousedown', onDoc))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDoc))
</script>

<template>
  <span ref="rootRef" class="pt-popconfirm" @keydown.esc="close">
    <span class="pt-popconfirm__trigger" @click.stop="open">
      <slot />
    </span>
    <span v-show="visible" class="pt-popconfirm__panel" :style="panelStyle" role="dialog">
      <span class="pt-popconfirm__title">
        <pt-icon class="pt-popconfirm__icon" :path="iconWarning" />
        <span>{{ title }}</span>
      </span>
      <span class="pt-popconfirm__actions">
        <pt-button size="small" @click="onCancel">{{ cancelText }}</pt-button>
        <pt-button size="small" type="primary" @click="onConfirm">{{ confirmText }}</pt-button>
      </span>
    </span>
  </span>
</template>
