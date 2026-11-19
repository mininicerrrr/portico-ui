# Tooltip 文字提示

悬浮或聚焦时显示提示。层级使用 `--pt-z-tooltip`（2500）。

## 基础用法

<DemoBox>
  <pt-tooltip content="保存当前草稿" placement="top">
    <pt-button>悬停查看</pt-button>
  </pt-tooltip>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 内容 | `string` | — |
| placement | 位置 | `top / bottom / left / right 及 -start/-end` | 'top' |
| effect | 主题 | `'dark' | 'light'` | 'dark' |
| disabled | 禁用 | `boolean` | false |
| showAfter / hideAfter | 延迟（毫秒） | `number` | 80 |

### Events

—
