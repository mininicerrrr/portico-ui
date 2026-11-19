# Switch

Toggle between two values. Space and Enter activate the control. The switch uses `role="switch"` and `aria-checked`. It is a short rectangular track with a square-ish 2px-radius knob, not an iOS capsule. The off track uses `--pt-switch-track`; the on fill is primary. Focus is a hard 2px offset ring.

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
