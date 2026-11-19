# Input

Text field with optional clear and password toggle. Labels from `PtFormItem` are associated through `id`. Validation errors set `aria-invalid` and `aria-describedby`. Controls use a 2px radius and 2px border. Focus is a 2px primary border with a hard offset ring and no soft glow. Error adds a 3px left danger rail; success is a 2px success border only.

<script setup>
import { ref } from 'vue'
const text = ref('')
const password = ref('secret')
</script>

## Basic usage

<DemoBox>
  <div style="max-width: 320px; display: grid; gap: 12px;">
    <pt-input v-model="text" placeholder="Type something" clearable />
    <pt-input v-model="password" show-password placeholder="Password" />
    <pt-input size="large" placeholder="Large" />
    <pt-input disabled placeholder="Disabled" />
  </div>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue / v-model | Bound value | `string \| number` | `''` |
| type | Native input type | `string` | `'text'` |
| placeholder | Placeholder | `string` | — |
| disabled | Disabled | `boolean` | `false` |
| readonly | Read-only | `boolean` | `false` |
| clearable | Show a clear button when the field has a value | `boolean` | `false` |
| showPassword | Password visibility toggle | `boolean` | `false` |
| size | Size | `'large' \| 'default' \| 'small'` | `'default'` |
| maxlength / minlength | Native length limits | `number \| string` | — |
| id | Input id, otherwise taken from `PtFormItem` | `string` | — |
| name | Native `name` | `string` | — |
| ariaLabel | Accessible name when no visible label is present | `string` | — |

## Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:modelValue / input | Emitted while typing | `value: string` |
| change | Emitted on commit or clear | `value: string` |
| focus / blur | Focus events | `event: FocusEvent` |
| clear | Emitted when the value is cleared | — |

## Slots

| Slot | Description |
| --- | --- |
| prefix | Content before the input |
| suffix | Content after the input |

## Methods

Exposed on the component ref: `focus()`, `blur()`.

## Validation states

Error and success visuals come from the parent `PtFormItem`. `is-error` appears after a failed validation. `is-success` is shown **only** when `validate-status="success"` is set — never automatically after a passing validation.

<DemoBox>
  <pt-space direction="vertical" style="width: 100%">
    <pt-form-item label="Error" validate-status="error" error="Name is required" label-width="64px">
      <pt-input model-value="" placeholder="Required" />
    </pt-form-item>
    <pt-form-item label="Success" validate-status="success" label-width="64px">
      <pt-input model-value="Ada" />
    </pt-form-item>
  </pt-space>
</DemoBox>

