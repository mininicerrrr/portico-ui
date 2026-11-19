<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../../locale'
import PtIcon from '../icons/PtIcon.vue'
import { iconClose, iconError, iconInfo, iconSuccess, iconWarning } from '../icons/icons'

export type AlertType = 'success' | 'warning' | 'error' | 'info'

export interface AlertProps {
  type?: AlertType
  title?: string
  description?: string
  closable?: boolean
  showIcon?: boolean
}

defineOptions({ name: 'PtAlert' })

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  closable: true,
  showIcon: true
})

const emit = defineEmits<{
  close: [event: MouseEvent]
}>()

const { t } = useLocale()
const visible = ref(true)
const icons: Record<AlertType, string> = {
  success: iconSuccess,
  warning: iconWarning,
  error: iconError,
  info: iconInfo
}
const iconPath = computed(() => icons[props.type])

function onClose(event: MouseEvent) {
  visible.value = false
  emit('close', event)
}
</script>

<template>
  <div v-if="visible" class="pt-alert" :class="`pt-alert--${type}`" :role="type === 'error' ? 'alert' : 'status'">
    <pt-icon v-if="showIcon" class="pt-alert__icon" :path="iconPath" />
    <div class="pt-alert__body">
      <div v-if="title || $slots.title" class="pt-alert__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.default" class="pt-alert__description">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <button v-if="closable" type="button" class="pt-alert__close" :aria-label="t('message.close')" @click="onClose">
      <pt-icon :path="iconClose" />
    </button>
  </div>
</template>
