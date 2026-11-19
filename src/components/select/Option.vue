<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { selectContextKey, type SelectOptionData } from './tokens'

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

const isSelected = computed(() => select?.selected === props.value)
const isHighlighted = computed(() => select?.highlighted === props.value)
const optionId = computed(() => select?.optionId(props.value))

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
    :id="optionId"
    class="pt-select__option"
    :class="{ 'is-selected': isSelected, 'is-highlighted': isHighlighted, 'is-disabled': disabled }"
    role="option"
    :aria-selected="isSelected"
    :aria-disabled="disabled || undefined"
    @click.stop="onPick"
  >
    <slot>{{ data.label }}</slot>
  </li>
</template>
