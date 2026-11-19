<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../../locale'
import PtIcon from '../icons/PtIcon.vue'
import { iconEmpty } from '../icons/icons'

export interface EmptyProps {
  description?: string
}

defineOptions({ name: 'PtEmpty' })

const props = defineProps<EmptyProps>()
const { t } = useLocale()
const text = computed(() => props.description ?? t('empty.description'))
</script>

<template>
  <div class="pt-empty">
    <div class="pt-empty__image">
      <slot name="image">
        <pt-icon class="pt-empty__icon" :path="iconEmpty" />
      </slot>
    </div>
    <p class="pt-empty__description">{{ text }}</p>
    <div v-if="$slots.default" class="pt-empty__action">
      <slot />
    </div>
  </div>
</template>
