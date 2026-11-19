# Checkbox

Use alone or inside `PtCheckboxGroup` with an array model. `indeterminate` is a visual mixed state and does not change the bound value by itself.

<script setup>
import { ref } from 'vue'
const agreed = ref(false)
const langs = ref(['vue'])
</script>

## Basic usage

<DemoBox>
  <pt-space direction="vertical">
    <pt-checkbox v-model="agreed">I agree</pt-checkbox>
    <pt-checkbox-group v-model="langs">
      <pt-checkbox value="vue">Vue</pt-checkbox>
      <pt-checkbox value="ts">TypeScript</pt-checkbox>
      <pt-checkbox value="vite" disabled>Vite</pt-checkbox>
    </pt-checkbox-group>
  </pt-space>
</DemoBox>

## Checkbox Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Checked state, or an array when used alone | `boolean \| Array` | — |
| value / label | Value represented in a group | `string \| number \| boolean` | — |
| disabled | Disabled | `boolean` | `false` |
| indeterminate | Mixed / indeterminate state | `boolean` | `false` |
| name | Native `name` | `string` | — |

## CheckboxGroup Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Selected values | `Array<string \| number \| boolean>` | `[]` |
| disabled | Disable the whole group | `boolean` | `false` |

## Events

| Event | Description | Arguments |
| --- | --- | --- |
| change | Emitted after the value changes | `checked` or the group array |
