# Menu 菜单

侧栏或顶栏导航。垂直模式宽度为 `--pt-sidebar-width`（232px），折叠后为 56px。菜单文案为 Medium 字重；选中项为 3px 主色左轨加主色浅底。

## 基础用法

<script setup>
import { ref } from 'vue'
const collapse = ref(false)
</script>
<DemoBox>
  <pt-button size="small" style="margin-bottom: 12px" @click="collapse = !collapse">折叠</pt-button>
  <pt-menu default-active="users" :collapse="collapse">
    <pt-menu-item index="home">首页</pt-menu-item>
    <pt-sub-menu index="org">
      <template #title>组织</template>
      <pt-menu-item index="users">用户</pt-menu-item>
      <pt-menu-item index="roles">角色</pt-menu-item>
    </pt-sub-menu>
  </pt-menu>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 模式 | `'vertical' | 'horizontal'` | 'vertical' |
| collapse | 折叠（垂直） | `boolean` | false |
| defaultActive | 当前项 index | `string` | — |
| router | 是否按 index 作为路由提示 | `boolean` | false |

### Events

select
