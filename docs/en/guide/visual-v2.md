# Visual v2 verification

Live **Vue components** (not static proposal art). Docs `base` is `/portico-ui/` — local preview: `http://127.0.0.1:4173/portico-ui/guide/visual-v2`.

<script setup>
import { ref, onMounted } from 'vue'
const rows = [
  { id: '1', name: 'Alex', email: 'alex@example.com', role: 'Admin' },
  { id: '2', name: 'Jordan', email: 'jordan@example.com', role: 'Editor' },
]
const columns = [
  { prop: 'name', label: 'Member' },
  { prop: 'email', label: 'Email' },
  { prop: 'role', label: 'Role' },
]
const tableLoading = ref(true)
onMounted(() => {
  setTimeout(() => { tableLoading.value = false }, 2800)
})
</script>

<DemoBox title="Composition" id="v2-composition">
  <pt-space wrap :size="12">
    <pt-input placeholder="Search name or email" style="width: 280px" />
    <pt-button type="primary">Add member</pt-button>
    <pt-button>Export</pt-button>
  </pt-space>
</DemoBox>

<DemoBox title="Buttons" id="v2-buttons">
  <pt-space wrap :size="12">
    <pt-button type="primary" style="min-width: 96px">Primary</pt-button>
    <pt-button type="primary" disabled style="min-width: 96px">Disabled</pt-button>
    <pt-button type="primary" loading style="min-width: 96px">Saving</pt-button>
    <pt-button style="min-width: 72px">Secondary</pt-button>
    <pt-button text>Text</pt-button>
  </pt-space>
</DemoBox>

<DemoBox title="Inputs" id="v2-inputs">
  <pt-space direction="vertical" style="width: 320px">
    <pt-input placeholder="Search" />
    <pt-input model-value="bad@" class="is-error" />
    <pt-input disabled model-value="Disabled" />
  </pt-space>
</DemoBox>

<DemoBox title="Table loading" id="v2-table-loading">
  <pt-table :columns="columns" :data="rows" :loading="tableLoading" stripe style="max-width: 720px" />
</DemoBox>

<DemoBox title="Dark" id="v2-dark">
  <div data-pt-theme="dark" style="padding: 16px; border-radius: 8px; background: var(--pt-bg-page)">
    <pt-input placeholder="Dark input" style="width: 220px" />
    <pt-table :columns="columns" :data="rows" :loading="true" style="max-width: 720px; margin-top: 12px" />
  </div>
</DemoBox>