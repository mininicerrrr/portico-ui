# Pagination

Compose total, page sizes, pager, and jumper through `layout`. Copy comes from the locale pack.

## Basic usage

<script setup>
import { ref } from 'vue'
const page = ref(1)
const size = ref(10)
</script>
<DemoBox>
  <pt-pagination v-model:current-page="page" v-model:page-size="size" :total="95" background />
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| currentPage / pageSize / total | Page / size / total | `number` | 1 / 10 / 0 |
| pagerCount | Pager button count | `number` | 7 |
| layout | Layout | `string` | 'total, sizes, prev, pager, next, jumper' |
| pageSizes | Available page sizes | `number[]` | [10, 20, 50, 100] |
| background / disabled / size | Background / disabled / size | `boolean / boolean / size` | false / false / default |

### Events

update:currentPage, update:pageSize, change
