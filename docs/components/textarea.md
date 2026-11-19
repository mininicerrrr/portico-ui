# Textarea 文本域

多行文本输入，支持自适应高度与字数统计。校验状态同样由 FormItem 驱动。

## 基础用法

<script setup>
import { ref } from 'vue'
const text = ref('一段说明')
</script>
<DemoBox>
  <pt-textarea v-model="text" :rows="3" maxlength="80" show-word-limit placeholder="请输入" />
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | `string` | '' |
| placeholder | 占位 | `string` | — |
| disabled / readonly | 禁用 / 只读 | `boolean` | false |
| rows | 行数 | `number` | 3 |
| autosize | 自适应高度 | `boolean | { minRows, maxRows }` | false |
| maxlength | 最大长度 | `number | string` | — |
| showWordLimit | 显示字数 | `boolean` | false |
| resize | 拖拽方向 | `'none' | 'both' | 'horizontal' | 'vertical'` | 'vertical' |

### Events

update:modelValue, input, change, focus, blur
