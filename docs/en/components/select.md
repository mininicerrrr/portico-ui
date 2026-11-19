# Select

A basic single-select dropdown. Bind `v-model`, pass `options` or `PtOption` children, and optionally disable the control. Keyboard: Enter or Space opens the list, arrow keys move the highlight, Enter confirms, Escape closes it. The trigger uses a 2px radius and 2px border; the open state is a 2px primary border with no soft glow. The panel is 4px radius; a selected option has a 3px left primary rail and a primary-soft fill.

<script setup>
import { ref } from 'vue'
const city = ref('shanghai')
const empty = ref()
const options = [
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Hangzhou', value: 'hangzhou' },
  { label: 'Shenzhen', value: 'shenzhen' },
  { label: 'Offline', value: 'offline', disabled: true }
]
const cities = [
  { label: 'Hangzhou', value: 'hz' },
  { label: 'Shanghai', value: 'sh' },
  { label: 'Shenzhen', value: 'sz' }
]
const multi = ref([])
const queryValue = ref(null)
</script>

## Basic usage

<DemoBox>
  <div style="max-width: 280px;">
    <pt-select v-model="city" :options="options" placeholder="Choose a city" />
  </div>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value | `string \| number \| boolean \| null` | — |
| options | Option list, used when no default slot is provided | `SelectOptionData[]` | `[]` |
| placeholder | Placeholder | `string` | `Please select` (locale) |
| disabled | Disabled | `boolean` | `false` |
| clearable | Show a clear button | `boolean` | `true` |
| size | Size | `'large' \| 'default' \| 'small'` | `'default'` |
| id | Control id, otherwise taken from `PtFormItem` | `string` | — |
| name | Hidden native input name for form submission | `string` | — |
| ariaLabel | Accessible name | `string` | — |

## Events

| Event | Description | Arguments |
| --- | --- | --- |
| change | Emitted after the value changes | `value` |
| visibleChange | Emitted when the menu opens or closes | `visible: boolean` |

## PtOption Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| label | Display text | `string` | `String(value)` |
| value | Option value | `string \| number \| boolean` | — |
| disabled | Disabled option | `boolean` | `false` |

## Filtering, remote search, and multiple

`filterable` enables typeahead filtering (or a custom `filterMethod`). Use `remote` with `remoteMethod` for server search and `loading` for the in-panel spinner. `multiple` renders compact tags, with `collapseTags` and `multipleLimit` as optional controls.

<DemoBox title="Filterable / multiple">
  <pt-space direction="vertical" style="width: 280px">
    <pt-select v-model="queryValue" :options="cities" filterable placeholder="Type to filter" />
    <pt-select v-model="multi" :options="cities" multiple collapse-tags />
  </pt-space>
</DemoBox>

```vue
<pt-select v-model="value" :options="cities" filterable />
<pt-select v-model="multi" :options="cities" multiple collapse-tags />
```

Added props: `filterable`, `filterMethod`, `remote`, `remoteMethod`, `loading`, `loadingText`, `noMatchText`, `noDataText`, `multiple`, `collapseTags`, `multipleLimit`. `modelValue` becomes an array in multiple mode.

