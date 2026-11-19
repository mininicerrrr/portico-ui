# Select 选择器

基础单选下拉。支持选项数组、`PtOption` 插槽、禁用和 `v-model`。可用键盘打开列表：方向键移动高亮，Enter / Space 确认，`Esc` 关闭。触发器为 2px 圆角与 2px 描边；展开时是 2px 主色边，没有柔和光晕。下拉面板圆角 4px；选中项为 3px 主色左轨加主色浅底。

<script setup>
import { ref } from 'vue'
const city = ref('shanghai')
const empty = ref()
const options = [
  { label: '上海', value: 'shanghai' },
  { label: '杭州', value: 'hangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '维护中', value: 'offline', disabled: true }
]
const cities = [
  { label: '杭州', value: 'hz' },
  { label: '上海', value: 'sh' },
  { label: '深圳', value: 'sz' }
]
const multi = ref([])
const queryValue = ref(null)
</script>

## 基础用法

<DemoBox>
  <div style="max-width: 280px; display: grid; gap: 12px;">
    <pt-select v-model="city" :options="options" placeholder="请选择城市" />
    <pt-select v-model="empty" disabled placeholder="禁用" :options="options" />
    <pt-select v-model="city">
      <pt-option label="上海" value="shanghai" />
      <pt-option label="杭州" value="hangzhou" />
    </pt-select>
  </div>
</DemoBox>

```vue
<pt-select v-model="city" :options="options" placeholder="请选择城市" />
```

## API

### Select Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | `string \| number \| boolean \| null` | — |
| options | 选项列表 | `{ label: string; value: string \| number \| boolean; disabled?: boolean }[]` | `[]` |
| placeholder | 占位文本 | `string` | `请选择`（随语言包） |
| disabled | 禁用 | `boolean` | `false` |
| clearable | 可清空 | `boolean` | `true` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |

### Option Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 展示文本 | `string` | 值为字符串时的文本 |
| value | 选项值 | `string \| number \| boolean` | — |
| disabled | 禁用该选项 | `boolean` | `false` |

## 筛选、远程与多选

`filterable` 支持输入过滤（或自定义 `filterMethod`）。`remote` 配合 `remoteMethod` 做远程搜索，并用 `loading` 展示加载中文案。`multiple` 以标签展示已选项，可用 `collapseTags` 与 `multipleLimit`。

<DemoBox title="可筛选 / 多选">
  <pt-space direction="vertical" style="width: 280px">
    <pt-select v-model="queryValue" :options="cities" filterable placeholder="输入筛选" />
    <pt-select v-model="multi" :options="cities" multiple collapse-tags />
  </pt-space>
</DemoBox>

```vue
<pt-select v-model="value" :options="cities" filterable />
<pt-select v-model="multi" :options="cities" multiple collapse-tags />
```

补充 Props：`filterable`、`filterMethod`、`remote`、`remoteMethod`、`loading`、`loadingText`、`noMatchText`、`noDataText`、`multiple`、`collapseTags`、`multipleLimit`。`modelValue` 在多选时为数组。

