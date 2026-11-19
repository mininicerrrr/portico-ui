# Tabs

In-place panels. v2 line tabs: 2px primary underline aligned to label width.

## Basic usage

<script setup>
import { ref } from 'vue'
const active = ref('one')
</script>
<DemoBox>
  <pt-tabs v-model="active">
    <pt-tab-pane label="Overview" name="one">Overview</pt-tab-pane>
    <pt-tab-pane label="Settings" name="two">Settings</pt-tab-pane>
  </pt-tabs>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model (Tabs) | Active pane | `string | number` | — |
| type | Type | `'line' | 'card'` | 'line' |
| label / name / disabled (TabPane) | Label / name / disabled | `string / string | number / boolean` | — |

### Events

update:modelValue, change
