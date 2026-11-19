# Tabs 标签页

在同一区域切换内容。v2 线条型激活项为文案下方 2px 行动蓝下划线（与文案同宽）。

## 基础用法

<script setup>
import { ref } from 'vue'
const active = ref('one')
</script>
<DemoBox>
  <pt-tabs v-model="active">
    <pt-tab-pane label="概览" name="one">概览内容</pt-tab-pane>
    <pt-tab-pane label="设置" name="two">设置内容</pt-tab-pane>
  </pt-tabs>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model (Tabs) | 当前页 | `string | number` | — |
| type | 样式 | `'line' | 'card'` | 'line' |
| label / name / disabled (TabPane) | 标题 / 名称 / 禁用 | `string / string | number / boolean` | — |

### Events

update:modelValue, change
