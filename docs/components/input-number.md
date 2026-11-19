# InputNumber 数字输入

带步进按钮的数字输入，支持最小值、最大值、步长与精度。

## 基础用法

<script setup>
import { ref } from 'vue'
const n = ref(2)
</script>
<DemoBox>
  <pt-input-number v-model="n" :min="0" :max="10" :step="1" />
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | `number | null` | — |
| min / max | 范围 | `number` | — |
| step | 步长 | `number` | 1 |
| precision | 精度 | `number` | — |
| controls | 显示步进按钮 | `boolean` | true |
| size | 尺寸 | `'large' | 'default' | 'small'` | 'default' |
| disabled | 禁用 | `boolean` | false |
| placeholder | 占位 | `string` | — |

### Events

update:modelValue, change, focus, blur
