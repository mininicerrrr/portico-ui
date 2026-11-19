# Quick start

## Register globally

```ts
import { createApp } from 'vue'
import PorticoUI from 'portico-ui'
import 'portico-ui/style.css'
import App from './App.vue'

createApp(App).use(PorticoUI).mount('#app')
```

```vue
<template>
  <pt-button type="primary">Submit</pt-button>
</template>
```

After the plugin is installed, `this.$message` is also available in Options API components. The `message` function can always be imported directly.

## Import on demand

```vue
<script setup lang="ts">
import { PtButton, PtInput } from 'portico-ui'
import 'portico-ui/style.css'
</script>

<template>
  <pt-button type="primary">Save</pt-button>
  <pt-input placeholder="Type here" />
</template>
```

## A minimal form

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { PtForm, PtFormItem, PtInput, PtButton, message } from 'portico-ui'

const formRef = ref()
const model = reactive({ name: '' })
const rules = { name: [{ required: true, message: 'Name is required', trigger: 'blur' }] }

async function onSubmit() {
  try {
    await formRef.value.validate()
    message.success('Looks good')
  } catch {
    message.error('Please check the form')
  }
}
</script>

<template>
  <pt-form ref="formRef" :model="model" :rules="rules" label-width="80px">
    <pt-form-item label="Name" prop="name">
      <pt-input v-model="model.name" />
    </pt-form-item>
    <pt-form-item>
      <pt-button type="primary" @click="onSubmit">Submit</pt-button>
    </pt-form-item>
  </pt-form>
</template>
```
