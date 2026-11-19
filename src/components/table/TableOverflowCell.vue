<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import PtTooltip from '../tooltip/Tooltip.vue'
import type { TooltipEffect } from '../tooltip/Tooltip.vue'
import type { PtPlacement } from '../../utils/placement'
import { useOverflowMeasure } from '../../composables/useOverflowMeasure'

export interface TableOverflowCellProps {
  text: string
  placement?: PtPlacement
  effect?: TooltipEffect
  /** When false, never attach tooltip or tabindex (escape hatch). */
  enableTooltip?: boolean
}

defineOptions({ name: 'PtTableOverflowCell' })

const props = withDefaults(defineProps<TableOverflowCellProps>(), {
  placement: 'top',
  effect: 'dark',
  enableTooltip: true
})

const cellRef = ref<HTMLElement>()
const textRef = toRef(props, 'text')
const { overflows } = useOverflowMeasure(cellRef, () => [textRef.value])

const showAccessibleTooltip = computed(
  () => props.enableTooltip && Boolean(props.text) && overflows.value
)
</script>

<template>
  <pt-tooltip
    v-if="enableTooltip"
    :content="text"
    :placement="placement"
    :effect="effect"
    :disabled="!showAccessibleTooltip"
    :triggers="['hover', 'focus']"
  >
    <span
      ref="cellRef"
      class="pt-table__cell"
      :class="{ 'pt-table__cell--overflow-focusable': showAccessibleTooltip }"
      :tabindex="showAccessibleTooltip ? 0 : undefined"
    ><slot>{{ text }}</slot></span>
  </pt-tooltip>
  <span v-else ref="cellRef" class="pt-table__cell"><slot>{{ text }}</slot></span>
</template>