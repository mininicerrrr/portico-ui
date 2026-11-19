# Visual v2 验证

本页为**真实 Vue** 验收台。`base`：`/portico-ui/`。开发：`vitepress dev` → `http://127.0.0.1:5173/portico-ui/guide/visual-v2`。

## 表格列宽与溢出（公开 API）

- 为列设置 **`width`（推荐）或 `minWidth`**，并开启 **`table-layout: fixed`**（`PtTable` 默认）。仅用 `minWidth` 且总宽超过容器时，列会被压缩，**必须用 `width` 约束比例**。
- 默认单元格使用 **`.pt-table__cell` 单行省略**；列级 **`showOverflowTooltip`**（默认 `true`）在悬停时用 `PtTooltip` 展示全文。自定义 **`slot` / `cell` 插槽** 时请用导出的 **`PtTableEllipsisCell`**（`.pt-table__cell` + Tooltip），库不会对插槽自动省略。
- **不要**用文档站全局 CSS 覆盖 `.pt-table td` 的 `display`/`overflow` 来“修”叠字——应在列配置上留足宽度。

<script setup>
import { computed, ref } from 'vue'

const members = [
  { id: '1', name: '陈明', email: 'ming@example.com', role: '管理员', status: '正常', updated: '2026-03-01' },
  { id: '2', name: '林悦', email: 'yue@example.com', role: '编辑', status: '正常', updated: '2026-02-28' },
  { id: '3', name: '王策', email: 'ce@example.com', role: '只读', status: '已停用', updated: '2026-02-20' },
  { id: '4', name: '品牌资产协作规范与交付验收清单', email: 'brand@example.com', role: '编辑', status: '正常', updated: '2026-02-18' },
]
/** 584px 内容宽 — 与捕获 manifest 对齐 */
const columns584 = [
  { prop: 'name', label: '成员', width: 148, sortable: true, showOverflowTooltip: true },
  { prop: 'email', label: '邮箱', width: 168, showOverflowTooltip: true },
  { prop: 'role', label: '角色', width: 88 },
  { prop: 'status', label: '状态', width: 80 },
  { prop: 'updated', label: '更新时间', width: 100, sortable: true, align: 'right' },
]
const columnsWide = [
  { prop: 'name', label: '成员', width: 220, sortable: true, showOverflowTooltip: true },
  { prop: 'email', label: '邮箱', width: 240, showOverflowTooltip: true },
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
const formEmail = ref('incomplete@')
const focusInput = ref('已填写内容')
const asyncInput = ref('异步校验中')
</script>

<DemoBox title="主场景组合（584px 内容宽 · 提案 01）" id="v2-composition">
  <div class="v2-workbench v2-shot-584 pt-theme pt-root">
    <pt-space wrap :size="12" style="align-items: center; margin-bottom: 12px">
      <pt-input v-model="query" placeholder="搜索姓名或邮箱" style="width: 240px" />
      <pt-select
        v-model="roleFilter"
        placeholder="全部角色"
        style="width: 120px"
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
      :columns="columns584"
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

<DemoBox title="按钮基线：默认 / 中性禁用 / 带文案加载" id="v2-buttons">
  <div class="pt-theme pt-root v2-shot-584" data-capture-label="idle row">
    <pt-space wrap :size="12">
      <pt-button id="v2-btn-primary-idle" type="primary" style="min-width: 96px">主要</pt-button>
      <pt-button type="primary" disabled style="min-width: 96px">禁用</pt-button>
      <pt-button type="primary" loading style="min-width: 108px">保存中</pt-button>
      <pt-button id="v2-btn-secondary" style="min-width: 72px">次要</pt-button>
      <pt-button text>文字操作</pt-button>
    </pt-space>
  </div>
</DemoBox>

<DemoBox title="按钮：键盘焦点（Tab 至 #v2-btn-primary-idle）" id="v2-buttons-focus">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-button id="v2-btn-focus-target" type="primary" style="min-width: 120px">主要 · 焦点环</pt-button>
  </div>
</DemoBox>

<DemoBox title="按钮：次要悬停（捕获前悬停 #v2-btn-hover-secondary）" id="v2-buttons-hover">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-button id="v2-btn-hover-secondary" style="min-width: 120px">次要 · 悬停</pt-button>
  </div>
</DemoBox>

<DemoBox title="按钮：主色按下（捕获时 mouse down，截图后 mouse up）" id="v2-buttons-pressed">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-button id="v2-btn-pressed-target" type="primary" style="min-width: 120px">主要 · 按下</pt-button>
  </div>
</DemoBox>

<DemoBox title="暗色：禁用 / 带文案加载" id="v2-buttons-dark">
  <div class="v2-dark-surface pt-theme pt-root" data-pt-theme="dark">
    <pt-space wrap :size="12">
      <pt-button type="primary" disabled style="min-width: 96px">禁用</pt-button>
      <pt-button type="primary" loading style="min-width: 108px">保存中</pt-button>
      <pt-button loading style="min-width: 108px">处理中</pt-button>
    </pt-space>
  </div>
</DemoBox>

<DemoBox title="输入：默认 / 焦点 / Form 错误文案" id="v2-inputs">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-space direction="vertical" style="width: 100%">
      <pt-input placeholder="搜索姓名或邮箱" />
      <pt-input id="v2-input-focus-field" v-model="focusInput" />
      <pt-form-item label="邮箱" required :error="'请输入有效邮箱地址'" style="width: 100%">
        <pt-input v-model="formEmail" />
      </pt-form-item>
    </pt-space>
  </div>
</DemoBox>

<DemoBox title="输入：异步后缀 Spinner（演示 suffix 插槽；无内置 loading prop）" id="v2-input-async">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-input v-model="asyncInput" style="width: 100%">
      <template #suffix>
        <pt-spinner style="width: 16px; height: 16px" />
      </template>
    </pt-input>
    <p style="margin: 8px 0 0; font-size: 12px; color: var(--pt-text-secondary)">组件未提供 <code>loading</code> 属性；异步态可用 <code>suffix</code> 插槽。</p>
  </div>
</DemoBox>

<DemoBox title="暗色：错误 Form + 禁用输入" id="v2-inputs-dark">
  <div class="v2-dark-surface pt-theme pt-root" data-pt-theme="dark" style="width: 100%; max-width: 584px">
    <pt-form-item label="邮箱" :error="'格式不正确'" style="width: 100%">
      <pt-input model-value="bad@" />
    </pt-form-item>
    <pt-input disabled model-value="已停用字段" style="width: 100%; margin-top: 12px" />
  </div>
</DemoBox>

<DemoBox title="表格：降序排序 + 当前行（捕获前点击表头与第 2 行）" id="v2-table-sorted">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-table
      id="v2-table-sorted-target"
      :columns="columns584"
      :data="members"
      highlight-current-row
      style="width: 100%"
    />
  </div>
</DemoBox>

<DemoBox title="表格：行悬停（捕获前悬停第 1 行）" id="v2-table-hover">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-table
      id="v2-table-hover-target"
      :columns="columns584"
      :data="members.slice(0, 3)"
      style="width: 100%"
    />
  </div>
</DemoBox>

<DemoBox title="表格：长文本 Tooltip（捕获前悬停第 4 行成员列）" id="v2-table-tooltip">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-table :columns="columns584" :data="members.slice(3)" style="width: 100%" />
  </div>
</DemoBox>

<DemoBox title="表格：空结果 · 较宽容器" id="v2-table-states">
  <div class="pt-theme pt-root v2-workbench">
    <pt-table :columns="columnsWide" :data="[]" empty-text="没有找到匹配的成员" style="width: 100%">
      <template #empty>
        <pt-empty description="没有找到匹配的成员">
          <pt-button text type="primary">清空筛选条件</pt-button>
        </pt-empty>
      </template>
    </pt-table>
  </div>
</DemoBox>

<DemoBox title="表格：骨架加载" id="v2-table-loading">
  <div class="pt-theme pt-root v2-shot-584">
    <pt-table :columns="columns584" :data="members" :loading="true" style="width: 100%" />
  </div>
</DemoBox>

<DemoBox title="暗色：工具栏 + 全宽表加载" id="v2-dark">
  <div class="v2-dark-surface pt-theme pt-root" data-pt-theme="dark">
    <pt-space wrap :size="12" style="margin-bottom: 12px">
      <pt-input placeholder="搜索姓名或邮箱" style="width: 220px" />
      <pt-select
        placeholder="全部角色"
        style="width: 120px"
        :options="[{ label: '全部角色', value: '' }, { label: '管理员', value: 'admin' }]"
      />
      <pt-button type="primary">+ 添加成员</pt-button>
    </pt-space>
    <pt-table :columns="columns584" :data="members" :loading="true" style="width: 100%" />
  </div>
</DemoBox>

<style>
.v2-shot-584 {
  width: 584px;
  max-width: 100%;
}
</style>