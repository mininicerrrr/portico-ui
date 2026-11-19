# Form 表单

将输入控件与校验规则组织在一起。`PtFormItem` 的 `label` 会通过 `for` 与控件 `id` 关联。当前提供基础必填、长度、正则和自定义校验，以及错误信息展示。

<script setup>
import { reactive, ref } from 'vue'
import { message } from 'portico-ui'

const formRef = ref()
const model = reactive({ name: '', role: '', agree: false })
const rules = {
  name: [
    { required: true, message: '请填写用户名', trigger: 'blur' },
    { min: 2, message: '至少两个字符', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  agree: [{
    validator: (value) => value === true || '请先同意协议',
    trigger: 'change'
  }]
}

async function onSubmit() {
  try {
    await formRef.value.validate()
    message.success('提交成功')
  } catch {
    message.error('请检查表单')
  }
}

function onReset() {
  formRef.value.resetFields()
}
</script>

## 基础校验

<DemoBox>
  <pt-form ref="formRef" :model="model" :rules="rules" label-width="96px" style="max-width: 420px;">
    <pt-form-item label="用户名" prop="name">
      <pt-input v-model="model.name" placeholder="请输入用户名" />
    </pt-form-item>
    <pt-form-item label="角色" prop="role">
      <pt-select v-model="model.role" :options="[{ label: '管理员', value: 'admin' }, { label: '编辑', value: 'editor' }]" placeholder="请选择" />
    </pt-form-item>
    <pt-form-item prop="agree">
      <pt-checkbox v-model="model.agree">同意服务条款</pt-checkbox>
    </pt-form-item>
    <pt-form-item>
      <pt-space>
        <pt-button type="primary" @click="onSubmit">提交</pt-button>
        <pt-button @click="onReset">重置</pt-button>
      </pt-space>
    </pt-form-item>
  </pt-form>
</DemoBox>

```vue
<pt-form ref="formRef" :model="model" :rules="rules" label-width="96px">
  <pt-form-item label="用户名" prop="name">
    <pt-input v-model="model.name" />
  </pt-form-item>
</pt-form>
```

顶部标签布局可将 `label-position` 设为 `top`。

## Form API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | `object` | — |
| rules | 校验规则，按 `prop` 索引 | `Record<string, FormRule \| FormRule[]>` | — |
| labelWidth | 标签宽度 | `string` | — |
| labelPosition | 标签位置 | `'right' \| 'left' \| 'top'` | `'right'` |
| disabled | 禁用表单内的输入控件 | `boolean` | `false` |
| size | 向子控件传递尺寸 | `'large' \| 'default' \| 'small'` | — |
| hideRequiredAsterisk | 隐藏必填星号 | `boolean` | `false` |

### Methods

通过 `ref` 调用：

| 方法 | 说明 |
| --- | --- |
| validate() | 校验全部字段，失败时 reject |
| validateField(prop) | 校验指定字段 |
| resetFields() | 重置为初始值并清除错误 |
| clearValidate(prop?) | 清除错误信息 |

### FormRule

`required`、`message`、`min`、`max`、`pattern`、`trigger`、`validator`。

## FormItem API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本 | `string` | — |
| prop | 对应 `model` 的路径 | `string` | — |
| required | 标记必填 | `boolean` | `false` |
| rules | 单项规则 | `FormRule \| FormRule[]` | — |
| error | 外部传入的错误文案 | `string` | — |
表单容器，支持校验、标签布局与表单项关联。v2：`PtFormItem` 可选 `validateStatus`；错误为 1px 危险描边 + 说明文案（无左轨），成功仅在显式 `success` 时出现 1px 成功描边。
| labelWidth | 覆盖表单标签宽度 | `string` | — |
| showMessage | 是否显示错误 | `boolean` | `true` |

## 成功状态

`PtFormItem` 可选 `validateStatus`（`'error' | 'success' | ''`）。v2：成功仅在显式 `success` 时为 1px 成功描边；错误为 1px 危险描边 + 说明文案。标签默认宽度 `--pt-form-label-width`（96px），Medium 字重。

