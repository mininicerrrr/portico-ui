# Checkbox 复选框

单独使用或通过 `PtCheckboxGroup` 绑定数组。

<script setup>
import { ref } from 'vue'
const agreed = ref(false)
const langs = ref(['vue'])
</script>

## 基础用法

<DemoBox>
  <pt-space direction="vertical">
    <pt-checkbox v-model="agreed">我已阅读协议</pt-checkbox>
    <pt-checkbox-group v-model="langs">
      <pt-checkbox value="vue">Vue</pt-checkbox>
      <pt-checkbox value="ts">TypeScript</pt-checkbox>
      <pt-checkbox value="vite" disabled>Vite</pt-checkbox>
    </pt-checkbox-group>
    <div style="color: var(--pt-text-secondary); font-size: 13px;">{{ langs.join(', ') || '未选择' }}</div>
  </pt-space>
</DemoBox>

## API

### Checkbox Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 是否选中，或独立使用时的数组 | `boolean \| Array` | — |
| value / label | 在组中代表的值 | `string \| number \| boolean` | — |
| disabled | 禁用 | `boolean` | `false` |
| indeterminate | 不确定态 | `boolean` | `false` |

### CheckboxGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 选中值数组 | `Array<string \| number \| boolean>` | `[]` |
| disabled | 禁用整组 | `boolean` | `false` |
