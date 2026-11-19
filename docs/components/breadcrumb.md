# Breadcrumb 面包屑

路径导航，默认分隔符为 `/`，可通过 `items` 或子组件传入。

## 基础用法

<DemoBox>
  <pt-breadcrumb :items="[{ label: '首页', to: '#' }, { label: '用户' }, { label: '详情' }]" />
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| separator | 分隔符 | `string` | '/' |
| items | 数据项 `{ label, to? }` | `array` | [] |

### Events

—
