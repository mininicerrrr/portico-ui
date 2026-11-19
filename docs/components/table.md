# Table 表格

用于展示行列数据。传入 `columns` 与 `data`，在没有数据时显示空状态。v2：表头 Medium + `--pt-bg-soft`，行间 1px 分隔，无竖向网格。行悬停 `--pt-bg-row-hover`，当前行/选中 `--pt-bg-row-selected`（无左侧轨）。`loading` 时保留表头与列宽，表体显示骨架条（暗色 `--pt-skeleton-fill` #2B3A4F），中部浮层显示「加载中…」+ 16px 旋转图标，无整表阻塞遮罩。

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
const sortColumns = [
  { prop: 'name', label: '名称', sortable: true },
  { prop: 'count', label: '数量', sortable: true }
]
const sortData = [
  { id: 1, name: '林', count: 3 },
  { id: 2, name: '艾达', count: 9 },
  { id: 3, name: '博', count: 1 }
]
const loading = ref(false)
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
| emptyText | 空状态文案 | `string` | `暂无数据`（随语言包） |
| rowKey | 行键名或函数 | `string \| Function` | `'id'` |
| maxHeight | 最大高度，超出滚动 | `string \| number` | — |
| loading | 表格加载遮罩 | `boolean` | `false` |
| highlightCurrentRow | 点击高亮当前行 | `boolean` | `false` |
| virtual | 显式开启虚拟滚动 | `boolean` | `false` |
| rowHeight | 虚拟行高 | `number` | `41` |

### TableColumn

`prop`、`label`、`width`、`minWidth`、`align`、`formatter`、`slot`、`sortable`（`true` 或 `custom`）、`sortMethod`。事件：`sort-change`、`current-change`。

### Slots

| 名称 | 说明 |
| --- | --- |
| cell | 通用单元格，作用域含 `row`、`column`、`index`、`value` |
| empty | 自定义空状态 |
| [column.slot] | 按列配置的具名插槽 |

## 排序、加载与虚拟滚动

列可设置 `sortable` 或 `sortMethod`；点击表头会发出 `sort-change`。`loading` 在表格上显示遮罩，而不是锁住整个页面。只有显式设置 `virtual` 时才会虚拟滚动（建议同时提供 `maxHeight`）。

<DemoBox>
  <pt-space style="margin-bottom: 12px">
    <pt-button size="small" @click="loading = !loading">切换加载</pt-button>
  </pt-space>
  <pt-table :columns="sortColumns" :data="sortData" :loading="loading" stripe />
</DemoBox>

`virtual` 示例（大数据量时使用）：

```vue
<pt-table :columns="columns" :data="rows" virtual :max-height="320" />
```

