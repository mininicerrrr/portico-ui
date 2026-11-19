# Table

Renders `columns` and `data`, and shows an empty state when there are no rows. Column slots receive `{ row, column, index, value }`. v2: Medium headers on `--pt-bg-soft`, 1px row separators, no vertical grid. Hover uses `--pt-bg-row-hover`; current/selected rows use `--pt-bg-row-selected` without a left rail. When `loading` is true, headers and column widths stay fixed; the body shows skeleton bars (dark `--pt-skeleton-fill` #2B3A4F) and a floating status pill with the locale loading label and a 16px spinner—not a blocking full-table mask.

<script setup>
import { ref } from 'vue'
const columns = [
  { prop: 'name', label: 'Name', width: 140 },
  { prop: 'role', label: 'Role', width: 120 },
  { prop: 'status', label: 'Status', slot: 'status' },
  { prop: 'note', label: 'Note' }
]
const data = [
  { id: 1, name: 'Ada', role: 'Admin', status: 'Active', note: 'Manages all modules' },
  { id: 2, name: 'Lin', role: 'Editor', status: 'Active', note: 'Maintains docs' },
  { id: 3, name: 'Chen', role: 'Guest', status: 'Disabled', note: 'Read only' }
]
const empty = []
const sortColumns = [
  { prop: 'name', label: 'Name', sortable: true },
  { prop: 'count', label: 'Count', sortable: true }
]
const sortData = [
  { id: 1, name: 'Lin', count: 3 },
  { id: 2, name: 'Ada', count: 9 },
  { id: 3, name: 'Bo', count: 1 }
]
const loading = ref(false)
</script>

## Basic usage

<DemoBox>
  <pt-table :columns="columns" :data="data" stripe>
    <template #status="{ value }">
      <pt-tag :type="value === 'Active' ? 'success' : 'info'">{{ value }}</pt-tag>
    </template>
  </pt-table>
  <div style="height: 16px;"></div>
  <pt-table :columns="columns" :data="[]" empty-text="No records" />
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column definitions | `TableColumn[]` | — |
| data | Row data | `object[]` | `[]` |
| stripe | Zebra rows | `boolean` | `false` |
| border | Cell borders | `boolean` | `false` |
| emptyText | Empty-state text | `string` | `No data` (locale) |
| rowKey | Unique row key, or a function | `string \| ((row, index) => string)` | `'id'` |
| maxHeight | Scroll the body when content exceeds this height | `string \| number` | — |
| loading | Overlay spinner | `boolean` | `false` |
| highlightCurrentRow | Highlight the clicked row | `boolean` | `false` |
| virtual | Enable virtual scroll explicitly | `boolean` | `false` |
| rowHeight | Virtual row height | `number` | `41` |

## TableColumn

| Field | Description | Type |
| --- | --- | --- |
| prop | Field name on the row | `string` |
| label | Header text | `string` |
| width / minWidth | Column width | `string \| number` |
| align | Cell alignment | `'left' \| 'center' \| 'right'` |
| formatter | Custom display value | `(row, column, cellValue, index) => string \| number` |
| slot | Named slot for the cell | `string` |

## Slots

| Slot | Description |
| --- | --- |
| [column.slot] | Custom cell for a named column |
| cell | Fallback custom cell for every column without a named slot |
| empty | Empty state |

## Sorting, loading, and virtual scroll

Mark a column `sortable` or provide `sortMethod`. Header clicks emit `sort-change`. `loading` paints an overlay on the table instead of blocking the page. Virtualization runs only when the `virtual` prop is set (combine it with `maxHeight`).

<DemoBox>
  <pt-space style="margin-bottom: 12px">
    <pt-button size="small" @click="loading = !loading">Toggle loading</pt-button>
  </pt-space>
  <pt-table :columns="sortColumns" :data="sortData" :loading="loading" stripe />
</DemoBox>

Virtual example:

```vue
<pt-table :columns="columns" :data="rows" virtual :max-height="320" />
```

