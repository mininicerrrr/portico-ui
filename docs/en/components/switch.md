# Switch

Toggle between two values. Space and Enter activate the control. The switch uses `role="switch"` and `aria-checked`.

<script setup>
import { ref } from 'vue'
const on = ref(true)
const mode = ref('light')
</script>

## Basic usage

<DemoBox>
  <pt-space>
    <pt-switch v-model="on" />
    <pt-switch v-model="on" disabled />
    <pt-switch v-model="on" active-text="On" inactive-text="Off" />
    <pt-switch v-model="mode" active-value="dark" inactive-value="light" />
  </pt-space>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value | `boolean \| string \| number` | — |
| disabled | Disabled | `boolean` | `false` |
| loading | Loading, also disables the switch | `boolean` | `false` |
| activeValue | Value when on | `boolean \| string \| number` | `true` |
| inactiveValue | Value when off | `boolean \| string \| number` | `false` |
| activeText / inactiveText | Labels on each side | `string` | — |
| size | Size | `'large' \| 'default' \| 'small'` | `'default'` |

## Events

| Event | Description | Arguments |
| --- | --- | --- |
| change | Emitted after the value changes | `value` |
