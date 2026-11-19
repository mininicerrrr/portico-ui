# Drawer

A panel that slides in from a screen edge. Accessibility matches Dialog: focus trap, Esc, `role="dialog"`, `aria-modal`, and focus return. Motion is 220ms. The panel uses a 4px radius, a 1px border, and a 4px top lintel in primary.

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
