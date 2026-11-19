# Notification 通知

命令式通知，API 与 `message` 相近：`notify()` / `notify.success()` 等。默认出现在右上角，层级 4500。

## 基础用法

<script setup>
import { notify } from 'portico-ui'
</script>
<DemoBox>
  <pt-button type="primary" @click="notify.success({ title: '已保存', message: '档案已更新。' })">发出通知</pt-button>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title / message | 标题 / 内容 | `string` | — |
| type | 类型 | `'success' | 'warning' | 'info' | 'error'` | 'info' |
| duration | 时长（0 为不自动关闭） | `number` | 4500 |
| position | 位置 | `top-right / top-left / bottom-right / bottom-left` | 'top-right' |
| showClose | 显示关闭 | `boolean` | true |

### Events

—（命令式 API，返回 { close }）
