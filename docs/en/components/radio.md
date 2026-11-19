# Radio

Pick a single value from a group. Use `value` (or the alias `label`) for the option value. The radio stays a circle (16×16, 2px border, 8px inner dot), not a pill button.

<script setup>
import { ref } from 'vue'
const size = ref('default')
</script>

## Basic usage

<DemoBox>
  <pt-radio-group v-model="size">
    <pt-radio value="large">Large</pt-radio>
    <pt-radio value="default">Default</pt-radio>
    <pt-radio value="small">Small</pt-radio>
  </pt-radio-group>
</DemoBox>

## Radio Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value when used alone | `string \| number \| boolean` | — |
| value / label | Value represented in a group | `string \| number \| boolean` | — |
| disabled | Disabled | `boolean` | `false` |
| name | Native `name`, inherited from the group when omitted | `string` | — |

## RadioGroup Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value | `string \| number \| boolean` | — |
| disabled | Disable the whole group | `boolean` | `false` |
| name | Shared native `name` | `string` | auto-generated |

## Events

| Event | Description | Arguments |
| --- | --- | --- |
| change | Emitted after the value changes | `value` |
