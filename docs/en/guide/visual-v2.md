# Visual v2 verification

This page renders **live Vue components** (not static proposal art) for comparison with the approved v2 targets. Noto Sans SC is loaded via Google Fonts.

<script setup>
import { ref } from 'vue'
const rows = [
  { id: '1', name: 'Alex', email: 'alex@example.com', role: 'Admin' },
  { id: '2', name: 'Jordan', email: 'jordan@example.com', role: 'Editor' },
]
const columns = [
  { prop: 'name', label: 'Member' },
  { prop: 'email', label: 'Email' },
  { prop: 'role', label: 'Role' },
]
const tableLoading = ref(false)
function toggleTableLoad() {
  tableLoading.value = !tableLoading.value
}
</script>

<DemoBox title="Button states (sample)">
  <pt-space wrap :size="12">
    <pt-button type="primary">Primary</pt-button>
    <pt-button type="primary" disabled>Disabled</pt-button>
    <pt-button type="primary" loading>Saving</pt-button>
    <pt-button>Secondary</pt-button>
    <pt-button text>Text</pt-button>
  </pt-space>
</DemoBox>

<DemoBox title="Input: default / error / disabled">
  <pt-space direction="vertical" style="width: 320px">
    <pt-input placeholder="Search name or email" />
    <pt-input model-value="bad@" class="is-error" />
    <pt-input disabled model-value="Disabled field" />
  </pt-space>
</DemoBox>

<DemoBox title="Table: hover, loading">
  <pt-button size="small" @click="toggleTableLoad">Toggle loading</pt-button>
  <div style="margin-top: 12px; max-width: 720px">
    <pt-table :columns="columns" :data="tableLoading ? [] : rows" :loading="tableLoading" stripe highlight-current-row />
  </div>
</DemoBox>

<DemoBox title="Dark局部">
  <div data-pt-theme="dark" style="padding: 16px; border-radius: 8px; background: var(--pt-bg-page)">
    <pt-space wrap>
      <pt-input placeholder="Dark input" style="width: 220px" />
      <pt-button type="primary">Add member</pt-button>
    </pt-space>
  </div>
</DemoBox>