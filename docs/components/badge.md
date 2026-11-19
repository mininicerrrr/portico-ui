# Badge 徽标

在元素上标记数量或红点。数字超过 `max` 时显示 `99+` 一类的溢出文案。

## 基础用法

<DemoBox>
  <pt-space :size="24">
    <pt-badge :value="8"><pt-button>消息</pt-button></pt-badge>
    <pt-badge :value="120" :max="99"><pt-button>通知</pt-button></pt-badge>
    <pt-badge is-dot type="primary"><pt-button>红点</pt-button></pt-badge>
  </pt-space>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 显示值 | `string | number` | — |
| max | 封顶值 | `number` | 99 |
| isDot | 红点 | `boolean` | false |
| type | 类型 | `'danger' | 'primary' | 'success' | 'warning' | 'info'` | 'danger' |
| hidden | 隐藏 | `boolean` | false |

### Events

—
