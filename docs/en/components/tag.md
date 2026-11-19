# Tag

A compact status or category mark. v2: 6px radius, light/solid/plain effects, no left color bar. `round` kept for API compatibility but does not produce pills.

<script setup>
import { ref } from 'vue'
const tags = ref(['Design', 'Review', 'Shipped'])
function remove(name) {
  tags.value = tags.value.filter((item) => item !== name)
}
</script>

## Basic usage

<DemoBox>
  <pt-space wrap>
    <pt-tag type="primary">Primary</pt-tag>
    <pt-tag type="success">Success</pt-tag>
    <pt-tag type="warning" effect="solid">Solid</pt-tag>
    <pt-tag v-for="item in tags" :key="item" type="danger" effect="plain" round closable @close="remove(item)">{{ item }}</pt-tag>
  </pt-space>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Visual type | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| effect | Fill style | `'light' \| 'solid' \| 'plain'` | `'light'` |
| size | Size | `'large' \| 'default' \| 'small'` | `'default'` |
| closable | Show a close button | `boolean` | `false` |
| round | Kept for compatibility; v2 tags stay 6px radius, not pills | `boolean` | `false` |

## Events

| Event | Description | Arguments |
| --- | --- | --- |
| close | Emitted when the close button is clicked | `event: MouseEvent` |
