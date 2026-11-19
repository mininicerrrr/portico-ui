# Popconfirm 气泡确认

在操作前弹出确认，基于弹出层实现，带警告图标。默认按钮文案来自语言包。

## 基础用法

<script setup>
import { message } from 'portico-ui'
</script>
<DemoBox>
  <pt-popconfirm title="确定删除这条记录？" @confirm="message.success('已删除')">
    <pt-button type="danger" plain>删除</pt-button>
  </pt-popconfirm>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | — |
| confirmButtonText / cancelButtonText | 按钮文案 | `string` | 语言包 |
| placement | 位置 | `placement` | 'top' |
| disabled | 禁用 | `boolean` | false |

### Events

confirm, cancel
