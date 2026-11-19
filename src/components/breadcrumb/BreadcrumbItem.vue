<script setup lang="ts">
import { inject, type ComputedRef } from 'vue'

export interface BreadcrumbItemProps {
  to?: string
}

defineOptions({ name: 'PtBreadcrumbItem' })

defineProps<BreadcrumbItemProps>()
const separator = inject<ComputedRef<string>>('ptBreadcrumbSeparator')
</script>

<template>
  <li class="pt-breadcrumb__item">
    <a v-if="to" class="pt-breadcrumb__link" :href="to"><slot /></a>
    <span v-else class="pt-breadcrumb__text"><slot /></span>
    <span class="pt-breadcrumb__separator" aria-hidden="true">{{ separator }}</span>
  </li>
</template>
