<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '../../locale'
import PtButton from '../button/Button.vue'
import PtIcon from '../icons/PtIcon.vue'
import { iconClose, iconFile, iconUpload } from '../icons/icons'

import type { UploadFile, UploadHttpRequest } from './types'

export type { UploadFile, UploadHttpRequest }

export interface UploadProps {
  action?: string
  httpRequest?: UploadHttpRequest
  accept?: string
  multiple?: boolean
  limit?: number
  drag?: boolean
  autoUpload?: boolean
  fileList?: UploadFile[]
  disabled?: boolean
  name?: string
}

defineOptions({ name: 'PtUpload' })

const props = withDefaults(defineProps<UploadProps>(), {
  autoUpload: true,
  fileList: () => [],
  name: 'file'
})

const emit = defineEmits<{
  'update:fileList': [files: UploadFile[]]
  onSuccess: [response: unknown, file: UploadFile, files: UploadFile[]]
  onError: [error: unknown, file: UploadFile, files: UploadFile[]]
  onProgress: [percent: number, file: UploadFile, files: UploadFile[]]
  onRemove: [file: UploadFile, files: UploadFile[]]
  onExceed: [files: File[]]
}>()

const { t } = useLocale()
const inputRef = ref<HTMLInputElement>()
const hovering = ref(false)
const innerList = ref<UploadFile[]>(props.fileList.slice())
let seed = 1

watch(
  () => props.fileList,
  (list) => {
    innerList.value = list.slice()
  }
)

const files = computed(() => innerList.value)

function sync(list: UploadFile[]) {
  innerList.value = list
  emit('update:fileList', list)
}

function defaultRequest(options: { file: File; action?: string; onProgress: (n: number) => void; onSuccess: (r?: unknown) => void; onError: (e?: unknown) => void }) {
  if (!options.action) {
    options.onSuccess()
    return
  }
  const xhr = new XMLHttpRequest()
  const form = new FormData()
  form.append(props.name, options.file)
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) options.onProgress(Math.round((event.loaded / event.total) * 100))
  }
  xhr.onerror = () => options.onError(new Error('upload failed'))
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        options.onSuccess(JSON.parse(xhr.responseText || 'null'))
      } catch {
        options.onSuccess(xhr.responseText)
      }
    } else options.onError(new Error(String(xhr.status)))
  }
  xhr.open('POST', options.action)
  xhr.send(form)
}

function uploadFile(item: UploadFile) {
  const raw = item.raw
  if (!raw) return
  item.status = 'uploading'
  item.percentage = 0
  const request = props.httpRequest ?? defaultRequest
  const result = request({
    file: raw,
    filename: props.name,
    action: props.action,
    onProgress(percent) {
      item.percentage = percent
      emit('onProgress', percent, item, files.value)
    },
    onSuccess(response) {
      item.status = 'success'
      item.percentage = 100
      item.response = response
      emit('onSuccess', response, item, files.value)
    },
    onError(error) {
      item.status = 'fail'
      item.error = error
      emit('onError', error, item, files.value)
    }
  })
  if (result && typeof (result as Promise<unknown>).then === 'function') {
    ;(result as Promise<unknown>).then(
      (response) => {
        if (item.status === 'uploading') {
          item.status = 'success'
          item.percentage = 100
          item.response = response
          emit('onSuccess', response, item, files.value)
        }
      },
      (error) => {
        if (item.status === 'uploading') {
          item.status = 'fail'
          item.error = error
          emit('onError', error, item, files.value)
        }
      }
    )
  }
}

function addFiles(list: File[]) {
  if (props.limit && files.value.length + list.length > props.limit) {
    emit('onExceed', list)
    return
  }
  const next = [...files.value]
  for (const raw of list) {
    seed += 1
    const item: UploadFile = {
      uid: Date.now() + seed,
      name: raw.name,
      status: 'ready',
      percentage: 0,
      raw,
      size: raw.size
    }
    next.push(item)
    if (props.autoUpload) uploadFile(item)
  }
  sync(next)
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const list = Array.from(target.files ?? [])
  target.value = ''
  if (list.length) addFiles(list)
}

function remove(file: UploadFile) {
  const next = files.value.filter((item) => item.uid !== file.uid)
  sync(next)
  emit('onRemove', file, next)
}

function retry(file: UploadFile) {
  uploadFile(file)
}

function openPicker() {
  if (props.disabled) return
  inputRef.value?.click()
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  hovering.value = false
  if (props.disabled) return
  addFiles(Array.from(event.dataTransfer?.files ?? []))
}

defineExpose({ submit: () => files.value.filter((item) => item.status === 'ready').forEach(uploadFile), clearFiles: () => sync([]) })
</script>

<template>
  <div class="pt-upload" :class="{ 'is-disabled': disabled, 'is-drag': drag }">
    <input
      ref="inputRef"
      class="pt-upload__input"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onInputChange"
    />
    <div
      v-if="drag"
      class="pt-upload__dragger"
      :class="{ 'is-hover': hovering }"
      @click="openPicker"
      @dragover.prevent="hovering = !disabled"
      @dragleave.prevent="hovering = false"
      @drop="onDrop"
    >
      <slot>
        <pt-icon class="pt-upload__icon" :path="iconUpload" />
        <p class="pt-upload__hint">{{ t('upload.drag') }}</p>
      </slot>
    </div>
    <div v-else class="pt-upload__trigger" @click="openPicker">
      <slot>
        <pt-button type="primary" :disabled="disabled">
          <template #icon><pt-icon :path="iconUpload" /></template>
          {{ t('upload.drag') }}
        </pt-button>
      </slot>
    </div>
    <ul class="pt-upload__list">
      <li v-for="file in files" :key="file.uid" class="pt-upload__item" :class="`is-${file.status}`">
        <pt-icon :path="iconFile" />
        <span class="pt-upload__name">{{ file.name }}</span>
        <span v-if="file.status === 'uploading'" class="pt-upload__percent">{{ file.percentage ?? 0 }}%</span>
        <button v-if="file.status === 'fail'" type="button" class="pt-upload__retry" @click="retry(file)">{{ t('upload.retry') }}</button>
        <button type="button" class="pt-upload__remove" :aria-label="t('tag.close')" @click="remove(file)">
          <pt-icon :path="iconClose" />
        </button>
      </li>
    </ul>
  </div>
</template>
