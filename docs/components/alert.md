# Alert 警告

静态的页面内提示，支持四种语义类型、标题、描述和关闭。

## 基础用法

<DemoBox>
  <pt-space direction="vertical" style="width: 100%">
    <pt-alert type="success" title="已保存" description="更改已写入。" />
    <pt-alert type="warning" title="请注意" description="该操作不可撤销。" />
  </pt-space>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'success' | 'warning' | 'error' | 'info'` | 'info' |
| title / description | 标题 / 描述 | `string` | — |
| closable | 可关闭 | `boolean` | true |
| showIcon | 显示图标 | `boolean` | true |

### Events

close
