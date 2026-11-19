<script setup lang="ts">
import PtTooltip from '../tooltip/Tooltip.vue'
import type { TooltipEffect } from '../tooltip/Tooltip.vue'
import type { PtPlacement } from '../../utils/placement'

export interface TableEllipsisCellProps {
  /** Cell text; also used as tooltip content when tooltip is enabled. */
  content?: string | number | null
  /** Show tooltip with full content on hover. Default true. */
  showOverflowTooltip?: boolean
  placement?: PtPlacement
  effect?: TooltipEffect
}

defineOptions({ name: 'PtTableEllipsisCell' })

const props = withDefaults(defineProps<TableEllipsisCellProps>(), {
  showOverflowTooltip: true,
  placement: 'top',
  effect: 'dark'
})

const label = () => {
  if (props.content == null) return ''
  return String(props.content)
}
</script>

<template>
  <pt-tooltip
    v-if="showOverflowTooltip && label()"
    :content="label()"
    :placement="placement"
    :effect="effect"
  >
    <span class="pt-table__cell"><slot>{{ label() }}</slot></span>
  </pt-tooltip>
  <span v-else class="pt-table__cell"><slot>{{ label() }}</slot></span>
</template>