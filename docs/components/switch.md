# Switch 开关

在开和关两种状态间切换。v2 轨道 6px 圆角；焦点为 3px 浅蓝环。禁用无 opacity 衰减。

<script setup>
import { ref } from 'vue'
const on = ref(true)
const status = ref('on')
</script>

## 基础用法

<DemoBox>
  <pt-space>
    <pt-switch v-model="on" active-text="已开启" inactive-text="已关闭" />
    <pt-switch v-model="on" disabled active-text="已开启" inactive-text="已关闭" />
    <pt-switch v-model="status" active-value="on" inactive-value="off" active-text="已开启" inactive-text="已关闭" />
    <pt-switch v-model="on" size="small" active-text="已开启" inactive-text="已关闭" />
    <pt-switch v-model="on" size="large" active-text="已开启" inactive-text="已关闭" />
  </pt-space>
</DemoBox>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | `boolean \| string \| number` | — |
| disabled | 禁用 | `boolean` | `false` |
| loading | 加载中 | `boolean` | `false` |
| activeValue | 打开时的值 | `boolean \| string \| number` | `true` |
| inactiveValue | 关闭时的值 | `boolean \| string \| number` | `false` |
| activeText / inactiveText | 两侧文案 | `string` | — |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
