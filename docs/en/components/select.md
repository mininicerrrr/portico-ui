# Select

A basic single-select dropdown. Bind `v-model`, pass `options` or `PtOption` children, and optionally disable the control. Keyboard: Enter or Space opens the list, arrow keys move the highlight, Enter confirms, Escape closes it.

<script setup>
import { ref } from 'vue'
const city = ref('shanghai')
const options = [
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Hangzhou', value: 'hangzhou' },
  { label: 'Shenzhen', value: 'shenzhen', disabled: true }
]
</script>

## Basic usage

<DemoBox>
  <div style="max-width: 280px;">
    <pt-select v-model="city" :options="options" placeholder="Choose a city" />
  </div>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value | `string \| number \| boolean \| null` | — |
| options | Option list, used when no default slot is provided | `SelectOptionData[]` | `[]` |
| placeholder | Placeholder | `string` | `'Please select'` |
| disabled | Disabled | `boolean` | `false` |
| clearable | Show a clear button | `boolean` | `true` |
| size | Size | `'large' \| 'default' \| 'small'` | `'default'` |
| id | Control id, otherwise taken from `PtFormItem` | `string` | — |
| name | Hidden native input name for form submission | `string` | — |
| ariaLabel | Accessible name | `string` | — |

## Events

| Event | Description | Arguments |
| --- | --- | --- |
| change | Emitted after the value changes | `value` |
| visibleChange | Emitted when the menu opens or closes | `visible: boolean` |

## PtOption Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| label | Display text | `string` | `String(value)` |
| value | Option value | `string \| number \| boolean` | — |
| disabled | Disabled option | `boolean` | `false` |
