# Visual v2 验证

本页渲染**真实 Vue 组件**（非静态提案图），用于对照已批准的 v2 设计稿。字体经 Google Fonts 加载 Noto Sans SC。

<script setup>
import { ref } from 'vue'
const rows = [
  { id: '1', name: '陈明', email: 'ming@example.com', role: '管理员' },
  { id: '2', name: '林悦', email: 'yue@example.com', role: '编辑' },
]
const columns = [
  { prop: 'name', label: '成员' },
  { prop: 'email', label: '邮箱' },
  { prop: 'role', label: '角色' },
]
const loading = ref(false)
const tableLoading = ref(false)
function toggleTableLoad() {
  tableLoading.value = !tableLoading.value
}
</script>

<DemoBox title="按钮状态矩阵（节选）">
  <pt-space wrap :size="12">
    <pt-button type="primary">主要</pt-button>
    <pt-button type="primary" disabled>禁用</pt-button>
    <pt-button type="primary" loading>保存中</pt-button>
    <pt-button>次要</pt-button>
    <pt-button text>文字操作</pt-button>
  </pt-space>
</DemoBox>

<DemoBox title="输入：默认 / 错误 / 禁用">
  <pt-space direction="vertical" style="width: 320px">
    <pt-input placeholder="搜索姓名或邮箱" />
    <pt-input model-value="incomplete@" class="is-error" placeholder="邮箱" />
    <pt-input disabled model-value="已停用字段" />
  </pt-space>
</DemoBox>

<DemoBox title="表格：悬停、加载、空态">
  <pt-button size="small" @click="toggleTableLoad">切换加载</pt-button>
  <div style="margin-top: 12px; max-width: 720px">
    <pt-table :columns="columns" :data="tableLoading ? [] : rows" :loading="tableLoading" stripe highlight-current-row />
  </div>
</DemoBox>

<DemoBox title="暗色局部（data-pt-theme）">
  <div data-pt-theme="dark" style="padding: 16px; border-radius: 8px; background: var(--pt-bg-page)">
    <pt-space wrap>
      <pt-input placeholder="暗色输入" style="width: 220px" />
      <pt-button type="primary">+ 添加成员</pt-button>
    </pt-space>
  </div>
</DemoBox>

## 字体加载自检

在开发者工具中选中任意按钮文字，**Computed → font-family** 应显示 `Noto Sans SC` 且 **font-weight** 为 400 或 500（勿出现 synthetic bold）。