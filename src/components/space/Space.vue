<script setup lang="ts">
import { computed, Comment, Fragment, Text, type VNode, useSlots } from 'vue'

export type SpaceSize = 'small' | 'default' | 'large' | number

export interface SpaceProps {
  direction?: 'horizontal' | 'vertical'
  size?: SpaceSize
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  wrap?: boolean
  spacer?: boolean
}

defineOptions({ name: 'PtSpace' })

const props = withDefaults(defineProps<SpaceProps>(), {
  direction: 'horizontal',
  size: 'default',
  wrap: false
})

const slots = useSlots() as { default?: () => VNode[] }

const gap = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  return { small: '8px', default: '12px', large: '16px' }[props.size]
})

function flatten(nodes: VNode[] = []): VNode[] {
  const result: VNode[] = []
  for (const node of nodes) {
    if (node.type === Comment) continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flatten(node.children as VNode[]))
      continue
    }
    if (node.type === Text && String(node.children ?? '').trim() === '') continue
    result.push(node)
  }
  return result
}

const children = computed(() => flatten((slots.default ? slots.default() : []) as VNode[]))
</script>

<template>
  <div
    class="pt-space"
    :class="[`pt-space--${direction}`, { 'is-wrap': wrap }]"
    :style="{ gap, alignItems: align }"
  >
    <template v-for="(child, index) in children" :key="index">
      <div class="pt-space__item">
        <component :is="child" />
      </div>
      <div v-if="spacer && index < children.length - 1" class="pt-space__spacer" />
    </template>
  </div>
</template>
