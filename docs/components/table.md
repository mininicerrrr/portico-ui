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

| 字段 | 说明 |
| --- | --- |
| prop / label | 字段与表头 |
| width / minWidth | 列宽（见下方集成指南） |
| align | `left` / `center` / `right` |
| formatter / slot / sortable / sortMethod | 格式化、插槽、排序 |
| showOverflowTooltip | `boolean`，默认 **`true`**：默认单元格单行省略 + 悬停 Tooltip 全文；设为 `false` 仍省略但不弹 Tooltip |

事件：`sort-change`、`current-change`。

## 列宽与长文本溢出（集成指南）

`PtTable` 使用 **`table-layout: fixed`** 与 **`colgroup`** 应用列宽。文本必须在 **`td` 内被 `.pt-table__cell` 包裹**才会在格内省略，否则会绘制到相邻列（与宿主侧是否重叠无关）。

1. **为每列设置 `width`（推荐）**（`px` 或 `%`），使各列宽度之和 **≤ 表格外层容器宽度**。仅设 `minWidth` 且总和超过容器时，列会被挤压，仍可能叠字。
2. **默认单元格**（无 `slot` / 无全局 `cell` 插槽）：自动渲染 `.pt-table__cell`；`showOverflowTooltip` 默认为 `true`（向后兼容：行为相对 v1 为「省略 + Tooltip」，可用 `false` 关闭 Tooltip）。
3. **自定义列 `slot` / 通用 `cell` 插槽**：库**不会**自动省略。请在插槽内使用 **`PtTableEllipsisCell`**（或自行套用相同结构的 `.pt-table__cell` + `PtTooltip`）。
4. **禁止**用应用或文档全局 CSS 覆盖 `.pt-table td { overflow: visible }`、改 `display` 等方式“修”叠字——应修正列宽与单元格内溢出。
5. **`PtInput.loading` 不存在**；输入框异步态请用 `suffix` 插槽（参见 [Visual v2 验证](./visual-v2#v2-input-async)）。

```vue
<pt-table :columns="columns" :data="rows" style="width: 100%">
  <template #title="{ value }">
    <pt-table-ellipsis-cell :content="value" />
  </template>
</pt-table>
```

```ts
const columns = [
  { prop: 'title', label: '标题', width: 200, slot: 'title' },
  { prop: 'email', label: '邮箱', width: 220, showOverflowTooltip: true },
  { prop: 'role', label: '角色', width: 96 },
]
```

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

