# Drawer

Edge panel with the same a11y contract as Dialog. v2: 6px radius, 1px border, no top lintel; 220ms motion.

## Basic usage

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
<DemoBox>
  <pt-button type="primary" @click="open = true">Open drawer</pt-button>
  <pt-drawer v-model="open" title="Details" placement="right">Drawer body</pt-drawer>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value | `boolean` | false |
| title | Title | `string` | — |
| placement | Placement | `'left' | 'right' | 'top' | 'bottom'` | 'right' |
| size | Size | `string | number` | '360px' |
| closeOnClickModal / closeOnPressEscape / showClose | Dismiss options | `boolean` | true |

### Events

update:modelValue, open, opened, close, closed
