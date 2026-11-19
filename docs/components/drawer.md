# Drawer 抽屉

从屏幕边缘滑出的面板。无障碍行为与对话框一致：焦点陷阱、Esc 关闭、`role="dialog"`、`aria-modal`、关闭后归还焦点。运动时长 220ms。面板圆角 4px，1px 描边，顶部有 4px 主色门楣。

## 基础用法

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
<DemoBox>
  <pt-button type="primary" @click="open = true">打开抽屉</pt-button>
  <pt-drawer v-model="open" title="详情" placement="right">这里是抽屉内容。</pt-drawer>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 是否显示 | `boolean` | false |
| title | 标题 | `string` | — |
| placement | 方向 | `'left' | 'right' | 'top' | 'bottom'` | 'right' |
| size | 宽度或高度 | `string | number` | '360px' |
| closeOnClickModal / closeOnPressEscape / showClose | 关闭方式 | `boolean` | true |

### Events

update:modelValue, open, opened, close, closed
