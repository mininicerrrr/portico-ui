# Table 表格

用于展示行列数据。传入 `columns` 与 `data`，在没有数据时显示空状态。

<script setup>
import { ref } from 'vue'
const columns = [
  { prop: 'name', label: '名称', width: 140 },
  { prop: 'role', label: '角色', width: 120 },
  { prop: 'status', label: '状态', slot: 'status' },
  { prop: 'note', label: '备注' }
]
const data = [
  { id: 1, name: 'Ada', role: '管理员', status: '启用', note: '可管理全部模块' },
  { id: 2, name: 'Lin', role: '编辑', status: '启用', note: '可维护文档' },
  { id: 3, name: 'Chen', role: '访客', status: '停用', note: '只读' }
]
const empty = []
</script>

## 基础用法

<DemoBox>
  <pt-table :columns="columns" :data="data" stripe>
    <template #status="{ value }">
      <pt-tag :type="value === '启用' ? 'success' : 'info'">{{ value }}</pt-tag>
    </template>
  </pt-table>
</DemoBox>

## 空状态

<DemoBox>
  <pt-table :columns="columns" :data="empty" empty-text="暂无记录" />
</DemoBox>

```vue
<pt-table :columns="columns" :data="data" stripe empty-text="暂无记录" />
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列定义 | `TableColumn[]` | — |
| data | 行数据 | `object[]` | `[]` |
| stripe | 斑马纹 | `boolean` | `false` |
| border | 单元格边框 | `boolean` | `false` |
| emptyText | 空状态文案 | `string` | `'No data'` |
| rowKey | 行键名或函数 | `string \| Function` | `'id'` |
| maxHeight | 最大高度，超出滚动 | `string \| number` | — |

### TableColumn

`prop`、`label`、`width`、`minWidth`、`align`、`formatter`、`slot`（具名单元格插槽）。

### Slots

| 名称 | 说明 |
| --- | --- |
| cell | 通用单元格，作用域含 `row`、`column`、`index`、`value` |
| empty | 自定义空状态 |
| [column.slot] | 按列配置的具名插槽 |
