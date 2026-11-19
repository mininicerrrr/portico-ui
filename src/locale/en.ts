import type { PtLocale } from './types'

export const en: PtLocale = {
  locale: 'en',
  select: {
    placeholder: 'Please select',
    loadingText: 'Loading…',
    noMatchText: 'No matching options',
    noDataText: 'No data',
    clear: 'Clear'
  },
  table: {
    emptyText: 'No data',
    loadingText: 'Loading…'
  },
  pagination: {
    total: '{total} in total',
    sizes: '{n} / page',
    jumper: 'Go to',
    page: ''
  },
  datePicker: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today',
    year: '',
    month: '',
    placeholder: 'Pick a date',
    startPlaceholder: 'Start date',
    endPlaceholder: 'End date'
  },
  upload: {
    drag: 'Drop files here, or click to upload',
    exceed: 'The upload limit has been exceeded',
    retry: 'Retry',
    fileTooLarge: 'The file is too large'
  },
  empty: {
    description: 'No data'
  },
  dialog: {
    confirm: 'OK',
    cancel: 'Cancel',
    close: 'Close'
  },
  drawer: {
    close: 'Close'
  },
  popconfirm: {
    confirm: 'OK',
    cancel: 'Cancel',
    delete: 'Delete'
  },
  message: {
    close: 'Close'
  },
  notification: {
    close: 'Close'
  },
  form: {
    required: 'This field is required',
    min: 'Enter at least {min} characters',
    max: 'Enter at most {max} characters',
    invalid: 'Invalid value',
    invalidFormat: 'Invalid format'
  },
  input: {
    clear: 'Clear',
    showPassword: 'Show password',
    hidePassword: 'Hide password'
  },
  tag: {
    close: 'Remove'
  }
}

export default en
