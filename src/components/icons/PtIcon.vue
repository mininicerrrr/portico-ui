<script setup lang="ts">
defineOptions({ name: 'PtIcon' })

defineProps<{
  path: string
  label?: string
}>()
</script>

<template>
  <svg
    class="pt-icon"
    viewBox="0 0 16 16"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label"
    focusable="false"
    v-html="path"
  />
</template>
