export type UploadStatus = 'ready' | 'uploading' | 'success' | 'fail'

export interface UploadFile {
  uid: number
  name: string
  status: UploadStatus
  percentage?: number
  raw?: File
  url?: string
  response?: unknown
  error?: unknown
  size?: number
}

export interface UploadRequestOptions {
  file: File
  filename: string
  action?: string
  onProgress: (percent: number) => void
  onSuccess: (response?: unknown) => void
  onError: (error?: unknown) => void
}

export type UploadHttpRequest = (options: UploadRequestOptions) => void | Promise<unknown>
