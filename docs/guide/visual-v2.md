# Visual v2 验证

本页渲染 **真实 Vue 组件**。站点 `base` 为 `/portico-ui/`。开发验证：`vitepress dev` → `http://127.0.0.1:5173/portico-ui/guide/visual-v2`；构建预览：`vitepress preview` → `http://127.0.0.1:4173/portico-ui/guide/visual-v2`。

<script setup>
import { computed, ref } from 'vue'
const members = [
  { id: '1', name: '陈明', email: 'ming@example.com', role: '管理员', status: '正常', updated: '2026-03-01' },
  { id: '2', name: '林悦', email: 'yue@example.com', role: '编辑', status: '正常', updated: '2026-02-28' },
  { id: '3', name: '王策', email: 'ce@example.com', role: '只读', status: '已停用', updated: '2026-02-20' },
  { id: '4', name: '品牌资产协作规范与交付验收清单', email: 'brand@example.com', role: '编辑', status: '正常', updated: '2026-02-18' },
]
const columns = [
  { prop: 'name', label: '成员', minWidth: 200, sortable: true },
  { prop: 'email', label: '邮箱', minWidth: 200 },
  { prop: 'role', label: '角色', width: 120 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'updated', label: '更新时间', width: 140, sortable: true, align: 'right' },
]
const roleFilter = ref('')
const query = ref('')
const page = ref(1)
const tableLoading = ref(false)
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return members.filter((row) => {
    const roleOk = !roleFilter.value || row.role === roleFilter.value
    const text = `${row.name} ${row.email}`.toLowerCase()
    return roleOk && (!q || text.includes(q))
  })
})
const paged = computed(() => {
  const start = (page.value - 1) * 5
  return filtered.value.slice(start, start + 5)
})
function triggerLoad() {
  tableLoading.value = true
  window.setTimeout(() => { tableLoading.value = false }, 2200)
}
</script>

<DemoBox title="主场景组合（对齐提案 01：工具栏 + 表格 + 分页）" id="v2-composition">
  <div class="v2-workbench pt-theme pt-root">
    <pt-space wrap :size="12" style="align-items: center; margin-bottom: 12px">
      <pt-input v-model="query" placeholder="搜索姓名或邮箱" style="width: 280px" />
      <pt-select
        v-model="roleFilter"
        placeholder="全部角色"
        style="width: 140px"
        :options="[
          { label: '全部角色', value: '' },
          { label: '管理员', value: '管理员' },
          { label: '编辑', value: '编辑' },
          { label: '只读', value: '只读' },
        ]"
      />
      <pt-button type="primary">+ 添加成员</pt-button>
      <pt-button>导出</pt-button>
    </pt-space>
    <pt-table
      :columns="columns"
      :data="paged"
      :loading="tableLoading"
      highlight-current-row
      style="width: 100%"
    />
    <pt-pagination
      v-model:current-page="page"
      :total="filtered.length"
      :page-size="5"
      layout="total, prev, pager, next"
      style="margin-top: 12px; justify-content: flex-end; width: 100%"
    />
    <pt-button size="small" text style="margin-top: 8px" @click="triggerLoad">演示加载态</pt-button>
  </div>
</DemoBox>

<DemoBox title="按钮：默认 / 禁用 / 加载 / 焦点" id="v2-buttons">
  <div class="pt-theme pt-root">
    <pt-space wrap :size="12">
      <pt-button type="primary" style="min-width: 96px">主要</pt-button>
      <pt-button type="primary" disabled style="min-width: 96px">禁用</pt-button>
      <pt-button type="primary" loading style="min-width: 96px">保存中</pt-button>
      <pt-button style="min-width: 72px">次要</pt-button>
      <pt-button text>文字操作</pt-button>
    </pt-space>
  </div>
</DemoBox>

<DemoBox title="输入：默认 / 错误 / 禁用" id="v2-inputs">
  <div class="pt-theme pt-root" style="width: 320px">
    <pt-space direction="vertical" style="width: 100%">
      <pt-input placeholder="搜索姓名或邮箱" />
      <pt-input model-value="incomplete@" class="is-error" />
      <pt-input disabled model-value="已停用字段" />
    </pt-space>
  </div>
</DemoBox>

<DemoBox title="表格：排序、当前行（悬停/选中）、空结果" id="v2-table-states">
  <div class="pt-theme pt-root v2-workbench">
    <p style="margin: 0 0 12px; color: var(--pt-text-secondary); font-size: 13px">点击表头排序；点击行高亮当前行。下方演示筛选无结果。</p>
    <pt-table :columns="columns" :data="members" highlight-current-row style="width: 100%" />
    <pt-table
      :columns="columns"
      :data="[]"
      empty-text="没有找到匹配的成员"
      style="width: 100%; margin-top: 16px"
    >
      <template #empty>
        <pt-empty description="没有找到匹配的成员">
          <pt-button text type="primary">清空筛选条件</pt-button>
        </pt-empty>
      </template>
    </pt-table>
  </div>
</DemoBox>

<DemoBox title="表格：骨架加载（保留表头与列宽）" id="v2-table-loading">
  <div class="pt-theme pt-root v2-workbench">
    <pt-table :columns="columns" :data="members" :loading="true" style="width: 100%" />
  </div>
</DemoBox>

<DemoBox title="暗色近景：工具栏 + 全宽表格加载" id="v2-dark">
  <div class="v2-dark-surface pt-theme pt-root" data-pt-theme="dark">
    <pt-space wrap :size="12" style="margin-bottom: 12px">
      <pt-input placeholder="搜索姓名或邮箱" style="width: 240px" />
      <pt-select
        placeholder="全部角色"
        style="width: 130px"
        :options="[{ label: '全部角色', value: '' }, { label: '管理员', value: 'admin' }]"
      />
      <pt-button type="primary">+ 添加成员</pt-button>
    </pt-space>
    <pt-table :columns="columns" :data="members" :loading="true" style="width: 100%" />
  </div>
</DemoBox>