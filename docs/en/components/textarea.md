# Textarea

Multi-line text input with autosize and an optional word limit. Validation states come from FormItem. Uses a 2px radius and 2px border, with no soft focus glow. Error adds a 3px left danger rail; success is a success border only.

## Basic usage

<script setup>
import { ref } from 'vue'
const text = ref('A short note')
</script>
<DemoBox>
  <pt-textarea v-model="text" :rows="3" maxlength="80" show-word-limit placeholder="Write something" />
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value | `string` | '' |
| placeholder | Placeholder | `string` | — |
| disabled / readonly | Disabled / readonly | `boolean` | false |
| rows | Rows | `number` | 3 |
| autosize | Autosize | `boolean | { minRows, maxRows }` | false |
| maxlength | Max length | `number | string` | — |
| showWordLimit | Show word count | `boolean` | false |
| resize | Resize direction | `'none' | 'both' | 'horizontal' | 'vertical'` | 'vertical' |

### Events

update:modelValue, input, change, focus, blur
