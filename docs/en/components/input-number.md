# InputNumber

Numeric input with stepper buttons, min/max, step, and precision. The control and steppers use a 2px radius and a shared 2px border; step buttons are 28px wide.

## Basic usage

<script setup>
import { ref } from 'vue'
const n = ref(2)
</script>
<DemoBox>
  <pt-input-number v-model="n" :min="0" :max="10" :step="1" />
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value | `number | null` | — |
| min / max | Range | `number` | — |
| step | Step | `number` | 1 |
| precision | Precision | `number` | — |
| controls | Show steppers | `boolean` | true |
| size | Size | `'large' | 'default' | 'small'` | 'default' |
| disabled | Disabled | `boolean` | false |
| placeholder | Placeholder | `string` | — |

### Events

update:modelValue, change, focus, blur
