<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="pt-demo">
    <div v-if="title" class="pt-demo__title">{{ title }}</div>
    <div class="pt-demo__body">
      <slot />
    </div>
  </div>
</template>
