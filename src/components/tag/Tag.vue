<script setup lang="ts">
import PtIcon from '../icons/PtIcon.vue'
import { iconClose } from '../icons/icons'
import { useLocale } from '../../locale'
export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type TagEffect = 'light' | 'solid' | 'plain'
export type TagSize = 'large' | 'default' | 'small'

export interface TagProps {
  type?: TagType
  effect?: TagEffect
  size?: TagSize
  closable?: boolean
  round?: boolean
}

defineOptions({ name: 'PtTag' })

const { t } = useLocale()

withDefaults(defineProps<TagProps>(), {
  type: 'default',
  effect: 'light',
  size: 'default'
})

const emit = defineEmits<{
  close: [event: MouseEvent]
}>()
</script>

<template>
  <span class="pt-tag" :class="[`pt-tag--${type}`, `pt-tag--${effect}`, `pt-tag--${size}`, { 'is-round': round }]">
    <slot />
    <button v-if="closable" type="button" class="pt-tag__close" :aria-label="t('tag.close')" @click="emit('close', $event)">
      <pt-icon :path="iconClose" />
    </button>
  </span>
</template>
