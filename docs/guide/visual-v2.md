# Visual v2 验证

本页为 **真实 Vue 组件** 渲染（非静态提案）。文档 `base` 为 `/portico-ui/`；本地预览地址：`http://127.0.0.1:4173/portico-ui/guide/visual-v2`。

<script setup>
import { ref, onMounted } from 'vue'
const rows = [
  { id: '1', name: '陈明', email: 'ming@example.com', role: '管理员' },
  { id: '2', name: '林悦', email: 'yue@example.com', role: '编辑' },
]
const columns = [
  { prop: 'name', label: '成员' },
  { prop: 'email', label: '邮箱' },
  { prop: 'role', label: '角色' },
]
const tableLoading = ref(true)
const focusBtn = ref()
onMounted(() => {
  setTimeout(() => { tableLoading.value = false }, 2800)
})
</script>

<DemoBox title="组合：搜索 + 主次按钮" id="v2-composition">
  <pt-space wrap :size="12" style="align-items: center">
    <pt-input placeholder="搜索姓名或邮箱" style="width: 280px" />
    <pt-button type="primary">+ 添加成员</pt-button>
    <pt-button>导出</pt-button>
  </pt-space>
</DemoBox>

<DemoBox title="按钮：默认 / 禁用 / 加载 / 焦点" id="v2-buttons">
  <pt-space wrap :size="12">
    <pt-button type="primary" ref="focusBtn" style="min-width: 96px">主要</pt-button>
    <pt-button type="primary" disabled style="min-width: 96px">禁用</pt-button>
    <pt-button type="primary" loading style="min-width: 96px">保存中</pt-button>
    <pt-button style="min-width: 72px">次要</pt-button>
    <pt-button text>文字操作</pt-button>
  </pt-space>
</DemoBox>

<DemoBox title="输入：默认 / 错误 / 禁用" id="v2-inputs">
  <pt-space direction="vertical" style="width: 320px">
    <pt-input placeholder="搜索姓名或邮箱" />
    <pt-input model-value="incomplete@" class="is-error" />
    <pt-input disabled model-value="已停用字段" />
  </pt-space>
</DemoBox>

<DemoBox title="表格：骨架加载（保留表头）" id="v2-table-loading">
  <pt-table :columns="columns" :data="rows" :loading="tableLoading" stripe highlight-current-row style="max-width: 720px" />
</DemoBox>

<DemoBox title="表格：数据态" id="v2-table-data">
  <pt-table :columns="columns" :data="rows" stripe highlight-current-row style="max-width: 720px" />
</DemoBox>

<DemoBox title="暗色：输入 + 主按钮" id="v2-dark">
  <div data-pt-theme="dark" style="padding: 16px; border-radius: 8px; background: var(--pt-bg-page)">
    <pt-space wrap>
      <pt-input placeholder="暗色输入" style="width: 220px" />
      <pt-button type="primary">+ 添加成员</pt-button>
    </pt-space>
    <pt-table :columns="columns" :data="rows" :loading="true" style="max-width: 720px; margin-top: 12px" />
  </div>
</DemoBox>