# DatePicker

v1 supports only `date` and `daterange`. Use `format` for display and `valueFormat` for the bound value. The panel uses a 4px radius. Day cells are 2px-radius squares, not pills. The selected day is a primary fill; a range uses primary-soft with square-ish 2px ends.

## Basic usage

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Type | `'date' | 'daterange'` | 'date' |
| modelValue / v-model | Bound value | `Date | string | [start, end] | null` | — |
| placeholder / startPlaceholder / endPlaceholder | Placeholders | `string` | 语言包 |
| format / valueFormat | Display / value format | `string` | 'YYYY-MM-DD' / — |
| disabledDate | Disabled date predicate | `(date: Date) => boolean` | — |
| clearable / disabled / size | Clearable / disabled / size | `boolean / boolean / size` | true / false / default |

### Events

update:modelValue, change, focus, blur
