# Message 消息

命令式消息提示，从页面顶部弹出，默认约 3 秒后关闭。

<script setup>
import { message } from 'portico-ui'
</script>

## 基础用法

<DemoBox>
  <pt-space wrap>
    <pt-button @click="message('普通消息')">默认</pt-button>
    <pt-button type="success" @click="message.success('保存成功')">成功</pt-button>
    <pt-button type="warning" @click="message.warning('请注意检查')">警告</pt-button>
    <pt-button type="danger" @click="message.error('操作失败')">错误</pt-button>
    <pt-button type="info" @click="message.info('已同步')">信息</pt-button>
    <pt-button @click="message({ message: '可手动关闭', showClose: true, duration: 0 })">手动关闭</pt-button>
  </pt-space>
</DemoBox>

```ts
import { message } from 'portico-ui'

message.success('保存成功')
message({ message: '可手动关闭', type: 'info', showClose: true, duration: 0 })
message.closeAll()
```

插件安装后，选项式 API 也可使用 `this.$message`。

## API

| 方法 | 说明 |
| --- | --- |
| `message(options)` | 显示消息，`options` 可为字符串或配置对象 |
| `message.success / warning / info / error` | 按类型显示 |
| `message.closeAll()` | 关闭全部 |

配置项：`message`、`type`、`duration`（毫秒，`0` 表示不自动关闭）、`showClose`、`onClose`。调用结果带有 `close()`。
