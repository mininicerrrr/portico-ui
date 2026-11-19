<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import type { NotificationType } from './types'
import PtIcon from '../icons/PtIcon.vue'
import { iconClose, iconError, iconInfo, iconSuccess, iconWarning } from '../icons/icons'
import { removeNotification } from './store'
import { useLocale } from '../../locale'

const icons: Record<NotificationType, string> = {
  success: iconSuccess,
  warning: iconWarning,
  info: iconInfo,
  error: iconError
}

const props = defineProps<{
  id: number
  title: string
  message: string
  type: NotificationType
  duration: number
  showClose: boolean
}>()

const { t } = useLocale()
let timer: number | undefined

function close() {
  removeNotification(props.id)
}

onMounted(() => {
  if (props.duration > 0) timer = window.setTimeout(close, props.duration)
})
onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
})
</script>

<template>
  <div class="pt-notification" :class="`pt-notification--${type}`" :role="type === 'error' ? 'alert' : 'status'">
    <pt-icon class="pt-notification__icon" :path="icons[type]" />
    <div class="pt-notification__body">
      <div v-if="title" class="pt-notification__title">{{ title }}</div>
      <div v-if="message" class="pt-notification__message">{{ message }}</div>
    </div>
    <button v-if="showClose" type="button" class="pt-notification__close" :aria-label="t('notification.close')" @click="close">
      <pt-icon :path="iconClose" />
    </button>
  </div>
</template>
