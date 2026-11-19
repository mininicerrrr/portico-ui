# Form

Groups controls with validation rules. `PtFormItem` labels are associated with controls through generated `id`s. Built-in checks cover required fields, length, patterns, and custom validators, plus error messages.

<script setup>
import { reactive, ref } from 'vue'
import { message } from 'portico-ui'
const formRef = ref()
const model = reactive({ name: '', role: '' })
const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  role: [{ required: true, message: 'Please choose a role', trigger: 'change' }]
}
async function onSubmit() {
  try {
    await formRef.value.validate()
    message.success('Submitted')
  } catch {
    message.error('Please check the form')
  }
}
</script>

<DemoBox>
  <pt-form ref="formRef" :model="model" :rules="rules" label-width="96px" style="max-width: 420px;">
    <pt-form-item label="Name" prop="name">
      <pt-input v-model="model.name" />
    </pt-form-item>
    <pt-form-item label="Role" prop="role">
      <pt-select v-model="model.role" :options="[{ label: 'Admin', value: 'admin' }, { label: 'Editor', value: 'editor' }]" />
    </pt-form-item>
    <pt-form-item>
      <pt-space>
        <pt-button type="primary" @click="onSubmit">Submit</pt-button>
        <pt-button @click="formRef.resetFields()">Reset</pt-button>
      </pt-space>
    </pt-form-item>
  </pt-form>
</DemoBox>

## Form API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| model | Form data object | `object` | — |
| rules | Validation rules, keyed by `prop` | `Record<string, FormRule \| FormRule[]>` | — |
| labelWidth | Label width | `string` | — |
| labelPosition | Label position | `'right' \| 'left' \| 'top'` | `'right'` |
| disabled | Disable nested input controls | `boolean` | `false` |
| size | Size passed to child controls | `'large' \| 'default' \| 'small'` | — |
| hideRequiredAsterisk | Hide the required asterisk | `boolean` | `false` |

### Methods

Call these on a `ref` to `PtForm`.

| Method | Description |
| --- | --- |
| validate() | Validate every field; rejects when invalid |
| validateField(prop) | Validate one field |
| resetFields() | Restore initial values and clear errors |
| clearValidate(prop?) | Clear error messages |

### FormRule

`required`, `message`, `min`, `max`, `pattern`, `trigger` (`blur` / `change`), and `validator`.

## FormItem API

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| label | Label text | `string` | — |
| prop | Path on `model` | `string` | — |
| required | Mark as required | `boolean` | `false` |
| rules | Field-level rules | `FormRule \| FormRule[]` | — |
| error | External error message | `string` | — |
| validateStatus | Explicit status; success shows only when set to success | `'error' \| 'success' \| ''` | — |
| labelWidth | Override the form label width | `string` | — |
| showMessage | Show the error message | `boolean` | `true` |
| size | Override the form size | `'large' \| 'default' \| 'small'` | — |

## Success state

`PtFormItem` accepts an optional `validateStatus` (`'error' | 'success' | ''`). The success ring appears only when `validateStatus="success"`; a passing validation does not enable it automatically. The default label width uses `--pt-form-label-width` (96px).

