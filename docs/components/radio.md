# Radio 单选框

在一组选项中选择唯一值。单选 16×16 圆形、1px 描边、8px 内圆点。

<script setup>
import { ref } from 'vue'
const size = ref('default')
</script>

## 基础用法

<DemoBox>
  <pt-radio-group v-model="size">
    <pt-radio value="large">大型</pt-radio>
    <pt-radio value="default">默认</pt-radio>
    <pt-radio value="small">小型</pt-radio>
    <pt-radio value="off" disabled>不可用</pt-radio>
  </pt-radio-group>
</DemoBox>

## API

### Radio Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 当前值（单独使用） | `string \| number \| boolean` | — |
| value / label | 选项值 | `string \| number \| boolean` | — |
| disabled | 禁用 | `boolean` | `false` |
| name | 原生 name | `string` | 组内自动生成 |

### RadioGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 当前选中值 | `string \| number \| boolean` | — |
| disabled | 禁用整组 | `boolean` | `false` |
