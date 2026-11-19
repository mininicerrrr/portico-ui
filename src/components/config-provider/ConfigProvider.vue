<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { localeContextKey, zhCN, type PtLocale } from '../../locale'

export interface ConfigProviderProps {
  locale?: PtLocale
}

defineOptions({ name: 'PtConfigProvider' })

const props = defineProps<ConfigProviderProps>()
const parent = inject(localeContextKey, undefined)
const locale = computed(() => props.locale ?? parent?.value ?? zhCN)

provide(localeContextKey, locale)
</script>

<template>
  <div class="pt-config-provider">
    <slot />
  </div>
</template>
