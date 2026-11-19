# Input 输入框

文本输入控件。支持清除、密码可见切换、尺寸和禁用。可与表单项关联，标签通过 `id` 指向输入框。

<script setup>
import { ref } from 'vue'
const text = ref('')
const password = ref('secret')
</script>

## 基础用法

<DemoBox>
  <div style="max-width: 320px; display: grid; gap: 12px;">
    <pt-input v-model="text" placeholder="请输入内容" clearable />
    <pt-input :model-value="text" disabled placeholder="禁用" />
  </div>
</DemoBox>

```vue
<pt-input v-model="text" placeholder="请输入内容" clearable />
```

## 密码框与尺寸

<DemoBox>
  <pt-space direction="vertical" style="max-width: 320px; width: 100%;">
    <pt-input v-model="password" show-password placeholder="请输入密码" />
    <pt-input size="large" placeholder="大型" />
    <pt-input placeholder="默认" />
    <pt-input size="small" placeholder="小型" />
  </pt-space>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | `string \| number` | `''` |
| type | 原生输入类型 | `string` | `'text'` |
| placeholder | 占位文本 | `string` | — |
| disabled | 禁用 | `boolean` | `false` |
| readonly | 只读 | `boolean` | `false` |
| clearable | 显示清除按钮 | `boolean` | `false` |
| showPassword | 显示密码切换；`type="password"` 时同样生效 | `boolean` | `false` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| maxlength / minlength | 长度限制 | `number \| string` | — |
| id | 自定义 id，默认使用表单项生成的 id | `string` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `(value: string)` |
| change | 在 change 时触发 | `(value: string)` |
| focus / blur | 聚焦或失焦 | `(event: FocusEvent)` |
| clear | 点击清除 | — |

### Slots

| 名称 | 说明 |
| --- | --- |
| prefix | 前置内容 |
| suffix | 后置内容 |

## 校验状态

错误与成功外观由所在的 `PtFormItem` 驱动。`is-error` 会在校验失败时出现；`is-success` **仅当** `validate-status="success"` 时显示，不会在每次校验通过后自动出现。

<DemoBox>
  <pt-space direction="vertical" style="width: 100%">
    <pt-form-item label="错误" validate-status="error" error="请填写名称" label-width="64px">
      <pt-input model-value="" placeholder="必填" />
    </pt-form-item>
    <pt-form-item label="成功" validate-status="success" label-width="64px">
      <pt-input model-value="Ada" />
    </pt-form-item>
  </pt-space>
</DemoBox>

