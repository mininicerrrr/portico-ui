# Upload 上传

自定义 `httpRequest` 是主要上传路径，`action` 可选。支持按钮、列表与拖拽（`drag`）三种形态。拖拽区为 2px 虚线描边（更偏墨色的 `--pt-border-color`）和 4px 圆角。

## 基础用法

<script setup>
import { ref } from 'vue'
import { message } from 'portico-ui'
const files = ref([])
function httpRequest({ file, onProgress, onSuccess }) {
  onProgress(60)
  setTimeout(() => onSuccess({ name: file.name }), 400)
}
</script>
<DemoBox>
  <pt-upload v-model:file-list="files" :http-request="httpRequest" drag @on-success="() => message.success('上传完成')" />
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| httpRequest | 自定义请求（主路径） | `function` | — |
| action | 可选上传地址 | `string` | — |
| accept / multiple / limit | 类型 / 多选 / 数量限制 | `string / boolean / number` | — |
| drag | 拖拽区域 | `boolean` | false |
| autoUpload | 自动上传 | `boolean` | true |
| fileList / v-model:fileList | 文件列表 | `UploadFile[]` | [] |
| disabled | 禁用 | `boolean` | false |

### Events

onSuccess, onError, onProgress, onRemove, onExceed, update:fileList
