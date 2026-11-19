<script setup lang="ts">
import { computed } from 'vue'
import { notificationState } from './store'
import NotificationItem from './NotificationItem.vue'
import type { NotificationPosition } from './types'

defineOptions({ name: 'PtNotificationHost' })

const positions: NotificationPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left']
const grouped = computed(() =>
  Object.fromEntries(positions.map((position) => [position, notificationState.items.filter((item) => item.position === position)])) as Record<
    NotificationPosition,
    typeof notificationState.items
  >
)
</script>

<template>
  <div
    v-for="position in positions"
    :key="position"
    class="pt-notification-host"
    :class="`pt-notification-host--${position}`"
    aria-live="polite"
  >
    <notification-item v-for="item in grouped[position]" :key="item.id" v-bind="item" />
  </div>
</template>
