# Switch

Toggle between two values. v2: short rectangular track (6px radius), not an iOS capsule. Off track `--pt-switch-track`, on fill primary. Focus uses the 3px pale ring; disabled without global opacity.

<script setup>
import { ref } from 'vue'
const on = ref(true)
const mode = ref('light')
</script>

## Basic usage

<DemoBox>
  <pt-space>
    <pt-switch v-model="on" active-text="已开启" inactive-text="已关闭" />
    <pt-switch v-model="on" disabled active-text="已开启" inactive-text="已关闭" />
    <pt-switch v-model="on" size="small" active-text="已开启" inactive-text="已关闭" />
    <pt-switch v-model="on" size="large" active-text="已开启" inactive-text="已关闭" />
    <pt-switch v-model="mode" active-value="dark" inactive-value="light" active-text="已开启" inactive-text="已关闭" />
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
