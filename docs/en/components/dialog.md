# Dialog

A modal panel. Focus moves into the dialog when it opens, Tab is trapped, and Escape closes it and restores focus.

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>

## Basic usage

<DemoBox>
  <pt-button type="primary" @click="visible = true">Open dialog</pt-button>
  <pt-dialog v-model="visible" title="Confirm" width="420px">
    <p>Apply this change to the current configuration?</p>
    <template #footer>
      <pt-button @click="visible = false">Cancel</pt-button>
      <pt-button type="primary" @click="visible = false">OK</pt-button>
    </template>
  </pt-dialog>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Visibility | `boolean` | `false` |
| title | Title, ignored when the `header` slot is used | `string` | — |
| width | Panel width | `string` | `'480px'` |
| closeOnClickModal | Close when the overlay is clicked | `boolean` | `true` |
| closeOnPressEscape | Close on Escape | `boolean` | `true` |
| showClose | Show the close button | `boolean` | `true` |
| destroyOnClose | Unmount content after close | `boolean` | `false` |
| appendToBody | Teleport to `document.body` | `boolean` | `true` |

## Events

| Event | Description |
| --- | --- |
| open | Before the dialog is shown |
| opened | After the dialog is shown and focused |
| close | When a close is requested |
| closed | After the dialog is hidden and focus is restored |
| update:modelValue | Visibility change |

## Slots

| Slot | Description |
| --- | --- |
| default | Body content |
| header | Custom header |
| footer | Footer actions |
