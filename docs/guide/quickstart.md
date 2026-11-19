# 快速开始

## 全量注册

在应用入口通过插件安装，即可在模板中直接使用 `Pt` 前缀组件：

```ts
import { createApp } from 'vue'
import PorticoUI from 'portico-ui'
import 'portico-ui/style.css'
import App from './App.vue'

createApp(App).use(PorticoUI).mount('#app')
```

```vue
<template>
  <pt-button type="primary">提交</pt-button>
</template>
```

安装插件后，也可以通过 `this.$message`（选项式 API）或直接导入的 `message` 函数调用消息提示。

## 按需引入

```vue
<script setup lang="ts">
import { PtButton, PtInput } from 'portico-ui'
import 'portico-ui/style.css'
</script>

<template>
  <pt-button type="primary">保存</pt-button>
  <pt-input placeholder="请输入" />
</template>
```

## 一个最小表单

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { PtForm, PtFormItem, PtInput, PtButton, message } from 'portico-ui'
import type { FormInstance } from 'vue'
import 'portico-ui/style.css'

const formRef = ref()
const model = reactive({ name: '' })
const rules = {
  name: [{ required: true, message: '请填写名称', trigger: 'blur' }]
}

async function onSubmit() {
  try {
    await formRef.value.validate()
    message.success('校验通过')
  } catch {
    message.error('请检查表单')
  }
}
</script>

<template>
  <pt-form ref="formRef" :model="model" :rules="rules" label-width="80px">
    <pt-form-item label="名称" prop="name">
      <pt-input v-model="model.name" placeholder="请输入名称" />
    </pt-form-item>
    <pt-form-item>
      <pt-button type="primary" @click="onSubmit">提交</pt-button>
    </pt-form-item>
  </pt-form>
</template>
```

## 语言包

默认使用 `zh-CN`。传入 `locale` 或使用 `PtConfigProvider` 即可切换：

```ts
import PorticoUI, { en } from 'portico-ui'
createApp(App).use(PorticoUI, { locale: en }).mount('#app')
```
