# Upload

A custom `httpRequest` is the primary upload path; `action` is optional. Variants: button, list, and drag (`drag`). The drop zone uses a 2px dashed inkier border (`--pt-border-color`) and a 4px radius.

## Basic usage

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
  <pt-upload v-model:file-list="files" :http-request="httpRequest" drag @on-success="() => message.success('Uploaded')" />
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| httpRequest | Custom request (primary) | `function` | — |
| action | Optional upload URL | `string` | — |
| accept / multiple / limit | Accept / multiple / limit | `string / boolean / number` | — |
| drag | Drag area | `boolean` | false |
| autoUpload | Auto upload | `boolean` | true |
| fileList / v-model:fileList | File list | `UploadFile[]` | [] |
| disabled | Disabled | `boolean` | false |

### Events

onSuccess, onError, onProgress, onRemove, onExceed, update:fileList
