# Dropdown 下拉菜单

触发器加菜单。菜单项通过 `command` 事件回传指令。

## 基础用法

<script setup>
import { message } from 'portico-ui'
</script>
<DemoBox>
  <pt-dropdown @command="(c) => message.info(String(c))">
    <pt-button>更多</pt-button>
    <template #dropdown>
      <pt-dropdown-item command="edit">编辑</pt-dropdown-item>
      <pt-dropdown-item command="delete" divided>删除</pt-dropdown-item>
    </template>
  </pt-dropdown>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| trigger | 触发方式 | `'hover' | 'click'` | 'hover' |
| placement | 位置 | `placement` | 'bottom-start' |
| disabled | 禁用 | `boolean` | false |

### Events

command, visibleChange
