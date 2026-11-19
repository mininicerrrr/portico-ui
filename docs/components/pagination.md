# Pagination 分页

通过 `layout` 组合总数、每页条数、页码与跳转。文案来自语言包：共 {n} 条、条/页、跳至、页。

## 基础用法

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| currentPage / pageSize / total | 当前页 / 每页条数 / 总数 | `number` | 1 / 10 / 0 |
| pagerCount | 页码按钮数 | `number` | 7 |
| layout | 布局 | `string` | 'total, sizes, prev, pager, next, jumper' |
| pageSizes | 可选每页条数 | `number[]` | [10, 20, 50, 100] |
| background / disabled / size | 背景 / 禁用 / 尺寸 | `boolean / boolean / size` | false / false / default |

### Events

update:currentPage, update:pageSize, change
