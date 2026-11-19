# Skeleton 骨架屏

加载占位。`variant` 支持文本、卡片与表格三种形态，可用 `animated` 控制扫光。

## 基础用法

<DemoBox>
  <pt-space direction="vertical" style="width: 100%">
    <pt-skeleton :rows="3" />
    <pt-skeleton variant="card" :rows="2" />
  </pt-space>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rows | 行数 | `number` | 3 |
| animated | 动画 | `boolean` | true |
| variant | 形态 | `'text' | 'card' | 'table'` | 'text' |

### Events

—
