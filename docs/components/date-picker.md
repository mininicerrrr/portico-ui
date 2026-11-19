# DatePicker 日期选择

第一版仅支持 `date` 与 `daterange`。可用 `format` 控制展示，`valueFormat` 控制绑定值格式。面板圆角 4px；日期格为 2px 圆角而不是胶囊。选中日为主色填充；范围用主色浅底，两端为 2px 方角。

## 基础用法

<script setup>
import { ref } from 'vue'
const day = ref('2026-11-19')
const range = ref([])
</script>
<DemoBox>
  <pt-space direction="vertical" style="width: 320px">
    <pt-date-picker v-model="day" value-format="YYYY-MM-DD" />
    <pt-date-picker v-model="range" type="daterange" value-format="YYYY-MM-DD" />
  </pt-space>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'date' | 'daterange'` | 'date' |
| modelValue / v-model | 绑定值 | `Date | string | [start, end] | null` | — |
| placeholder / startPlaceholder / endPlaceholder | 占位 | `string` | 语言包 |
| format / valueFormat | 展示 / 值格式 | `string` | 'YYYY-MM-DD' / — |
| disabledDate | 禁用日期 | `(date: Date) => boolean` | — |
| clearable / disabled / size | 清除 / 禁用 / 尺寸 | `boolean / boolean / size` | true / false / default |

### Events

update:modelValue, change, focus, blur
