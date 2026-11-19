# Popconfirm

Confirm an action in a small popover with a warning icon. Default button labels come from the locale.

## Basic usage

<script setup>
import { message } from 'portico-ui'
</script>
<DemoBox>
  <pt-popconfirm title="Delete this row?" @confirm="message.success('Deleted')">
    <pt-button type="danger" plain>Delete</pt-button>
  </pt-popconfirm>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Title | `string` | — |
| confirmButtonText / cancelButtonText | Button labels | `string` | 语言包 |
| placement | Placement | `placement` | 'top' |
| disabled | Disabled | `boolean` | false |

### Events

confirm, cancel
