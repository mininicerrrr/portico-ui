# Menu

Sidebar or header navigation. Vertical mode uses `--pt-sidebar-width` (232px) and collapses to 56px.

## Basic usage

<script setup>
import { ref } from 'vue'
const collapse = ref(false)
</script>
<DemoBox>
  <pt-button size="small" style="margin-bottom: 12px" @click="collapse = !collapse">Collapse</pt-button>
  <pt-menu default-active="users" :collapse="collapse">
    <pt-menu-item index="home">Home</pt-menu-item>
    <pt-sub-menu index="org">
      <template #title>Organization</template>
      <pt-menu-item index="users">Users</pt-menu-item>
      <pt-menu-item index="roles">Roles</pt-menu-item>
    </pt-sub-menu>
  </pt-menu>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| mode | Mode | `'vertical' | 'horizontal'` | 'vertical' |
| collapse | Collapse (vertical) | `boolean` | false |
| defaultActive | Active index | `string` | — |
| router | Treat index as a route hint | `boolean` | false |

### Events

select
