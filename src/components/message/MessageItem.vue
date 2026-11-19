<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import type { MessageType } from './types'
import PtIcon from '../icons/PtIcon.vue'
import { iconClose, iconError, iconInfo, iconSuccess, iconWarning } from '../icons/icons'
import { removeMessage } from './store'

const icons: Record<MessageType, string> = {
  success: iconSuccess,
  warning: iconWarning,
  info: iconInfo,
  error: iconError
}

const props = defineProps<{
  id: number
  message: string
  type: MessageType
  duration: number
  showClose: boolean
}>()

let timer: number | undefined

function close() {
  removeMessage(props.id)
}

onMounted(() => {
  if (props.duration > 0) {
    timer = window.setTimeout(close, props.duration)
  }
})

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
})
</script>

<template>
  <div class="pt-message" :class="`pt-message--${type}`" :role="type === 'error' ? 'alert' : 'status'">
    <pt-icon class="pt-message__icon" :path="icons[type]" />
    <span class="pt-message__text">{{ message }}</span>
    <button v-if="showClose" type="button" class="pt-message__close" aria-label="Close" @click="close">
      <pt-icon :path="iconClose" />
    </button>
  </div>
</template>
