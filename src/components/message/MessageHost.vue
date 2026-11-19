<script setup lang="ts">
import { messageState } from './store'
import MessageItem from './MessageItem.vue'

defineOptions({ name: 'PtMessageHost' })
</script>

<template>
  <div class="pt-message-host" aria-live="polite" aria-relevant="additions">
    <message-item v-for="item in messageState.items" :key="item.id" v-bind="item" />
  </div>
</template>
