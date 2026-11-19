# Drawer 抽屉

从屏幕边缘滑出的面板。无障碍与对话框一致（焦点陷阱、`Esc`、`aria-modal`）。v2：6px 圆角、1px 描边，无顶部门楣；动画 220ms。

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
