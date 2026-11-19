<script setup lang="ts">
import TableOverflowCell from './TableOverflowCell.vue'
import type { TooltipEffect } from '../tooltip/Tooltip.vue'
import type { PtPlacement } from '../../utils/placement'

export interface TableEllipsisCellProps {
  /** Cell text; also used as tooltip content when tooltip is enabled. */
  content?: string | number | null
  /** Show tooltip with full content when truncated. Default true; false is the escape hatch. */
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
  <table-overflow-cell
    :text="label()"
    :placement="placement"
    :effect="effect"
    :enable-tooltip="showOverflowTooltip"
  >
    <template #default>{{ label() }}</template>
  </table-overflow-cell>
</template>