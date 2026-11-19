# Dropdown

A trigger plus a menu. Items emit a `command` event.

## Basic usage

<script setup>
import { message } from 'portico-ui'
</script>
<DemoBox>
  <pt-dropdown @command="(c) => message.info(String(c))">
    <pt-button>More</pt-button>
    <template #dropdown>
      <pt-dropdown-item command="edit">Edit</pt-dropdown-item>
      <pt-dropdown-item command="delete" divided>Delete</pt-dropdown-item>
    </template>
  </pt-dropdown>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| trigger | Trigger | `'hover' | 'click'` | 'hover' |
| placement | Placement | `placement` | 'bottom-start' |
| disabled | Disabled | `boolean` | false |

### Events

command, visibleChange
