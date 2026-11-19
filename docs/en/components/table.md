# Table

Renders `columns` and `data`, and shows an empty state when there are no rows. Column slots receive `{ row, column, index, value }`.

<script setup>
const columns = [
  { prop: 'name', label: 'Name', width: 140 },
  { prop: 'role', label: 'Role' },
  { prop: 'status', label: 'Status', slot: 'status' }
]
const data = [
  { id: 1, name: 'Ada', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Lin', role: 'Editor', status: 'Idle' }
]
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
| emptyText | Empty-state text | `string` | `'No data'` |
| rowKey | Unique row key, or a function | `string \| ((row, index) => string)` | `'id'` |
| maxHeight | Scroll the body when content exceeds this height | `string \| number` | — |

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
