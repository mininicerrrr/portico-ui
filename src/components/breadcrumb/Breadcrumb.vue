<script setup lang="ts">
import { computed, provide } from 'vue'

export interface BreadcrumbItemData {
  label: string
  to?: string
}

export interface BreadcrumbProps {
  separator?: string
  items?: BreadcrumbItemData[]
}

defineOptions({ name: 'PtBreadcrumb' })

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
  items: () => []
})

provide('ptBreadcrumbSeparator', computed(() => props.separator))
</script>

<template>
  <nav class="pt-breadcrumb" aria-label="Breadcrumb">
    <ol class="pt-breadcrumb__list">
      <slot>
        <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="pt-breadcrumb__item">
          <a v-if="item.to" class="pt-breadcrumb__link" :href="item.to">{{ item.label }}</a>
          <span v-else class="pt-breadcrumb__text">{{ item.label }}</span>
          <span v-if="index < items.length - 1" class="pt-breadcrumb__separator" aria-hidden="true">{{ separator }}</span>
        </li>
      </slot>
    </ol>
  </nav>
</template>
