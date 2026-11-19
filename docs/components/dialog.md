# Dialog 对话框

在当前视图上打开模态面板。打开时会将焦点移入对话框并锁定 Tab 循环，`Esc` 关闭并归还焦点。面板圆角 4px，1px 描边，顶部有 4px 主色门楣。

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const open = ref(false)
const current = ref('default')
</script>

## 基础用法

<DemoBox>
  <pt-button type="primary" @click="visible = true">打开对话框</pt-button>
  <pt-dialog v-model="visible" title="确认操作" width="420px">
    <p>此操作将应用到当前配置，是否继续？</p>
    <template #footer>
      <pt-button @click="visible = false">取消</pt-button>
      <pt-button type="primary" @click="visible = false">确定</pt-button>
    </template>
  </pt-dialog>
</DemoBox>

```vue
<pt-dialog v-model="visible" title="确认操作">
  <p>内容</p>
  <template #footer>
    <pt-button @click="visible = false">取消</pt-button>
    <pt-button type="primary">确定</pt-button>
  </template>
</pt-dialog>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 是否显示 | `boolean` | `false` |
| title | 标题 | `string` | — |
| width | 面板宽度 | `string` | `'480px'` |
| size | 官方宽度 small/default/large（360/480/640） | `'small' \| 'default' \| 'large'` | `'default'` |
| closeOnClickModal | 点击遮罩关闭 | `boolean` | `true` |
| closeOnPressEscape | 按 Esc 关闭 | `boolean` | `true` |
| showClose | 显示关闭按钮 | `boolean` | `true` |
| destroyOnClose | 关闭后销毁内容 | `boolean` | `false` |
| appendToBody | 传送到 body | `boolean` | `true` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 主体内容 |
| header | 自定义标题区 |
| footer | 页脚，通常放置操作按钮 |

### Events

`open`、`opened`、`close`、`closed`、`update:modelValue`。

## 尺寸

`size` 为官方宽度：`small` 360px、`default` 480px、`large` 640px。传入 `width` 时以自定义宽度为准。

<DemoBox>
  <pt-space>
    <pt-button @click="current = 'small'; open = true">小</pt-button>
    <pt-button @click="current = 'default'; open = true">默认</pt-button>
    <pt-button @click="current = 'large'; open = true">大</pt-button>
  </pt-space>
  <pt-dialog v-model="open" title="对话框" :size="current">内容</pt-dialog>
</DemoBox>

