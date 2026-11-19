<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { selectContextKey, type SelectOptionData } from './tokens'
import PtIcon from '../icons/PtIcon.vue'
import { iconCheck } from '../icons/icons'

export interface OptionProps {
  label?: string
  value: string | number | boolean
  disabled?: boolean
}

defineOptions({ name: 'PtOption' })

const props = defineProps<OptionProps>()
const select = inject(selectContextKey, undefined)

const data = computed<SelectOptionData>(() => ({
  label: props.label ?? String(props.value),
  value: props.value,
  disabled: props.disabled
}))

const isSelected = computed(() => select?.isSelected(props.value) ?? false)
const isHighlighted = computed(() => select?.highlighted === props.value)
const optionId = computed(() => select?.optionId(props.value))
const isVisible = computed(() => select?.isOptionVisible(props.value) ?? true)

onMounted(() => select?.register(data.value))
watch(data, (value, old) => {
  if (!select) return
  select.unregister(old.value)
  select.register(value)
})
onBeforeUnmount(() => select?.unregister(props.value))

function onPick() {
  if (props.disabled) return
  select?.select(data.value)
}
</script>

<template>
  <li
    v-show="isVisible"
    :id="optionId"
    class="pt-select__option"
    :class="{ 'is-selected': isSelected, 'is-highlighted': isHighlighted, 'is-disabled': disabled }"
    role="option"
    :aria-selected="isSelected"
    :aria-disabled="disabled || undefined"
    @click.stop="onPick"
  >
    <span class="pt-select__option-label"><slot>{{ data.label }}</slot></span>
    <pt-icon v-if="isSelected" class="pt-select__option-check" :path="iconCheck" />
  </li>
</template>
