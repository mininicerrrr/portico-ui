# Switch 开关

在开和关两种状态间切换。支持键盘 Space / Enter。开关是短矩形轨道（2px 圆角）和略方的滑块，不是 iOS 胶囊。关闭轨道使用 `--pt-switch-track`，开启为主色；焦点是硬边 2px 偏移环。

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
