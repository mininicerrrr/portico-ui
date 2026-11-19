export interface PtLocale {
  locale: string
  select: {
    placeholder: string
    loadingText: string
    noMatchText: string
    noDataText: string
    clear: string
  }
  table: {
    emptyText: string
    loadingText: string
  }
  pagination: {
    total: string
    sizes: string
    jumper: string
    page: string
  }
  datePicker: {
    months: string[]
    weeks: string[]
    today: string
    year: string
    month: string
    placeholder: string
    startPlaceholder: string
    endPlaceholder: string
  }
  upload: {
    drag: string
    exceed: string
    retry: string
    fileTooLarge: string
  }
  empty: {
    description: string
  }
  dialog: {
    confirm: string
    cancel: string
    close: string
  }
  drawer: {
    close: string
  }
  popconfirm: {
    confirm: string
    cancel: string
    delete: string
  }
  message: {
    close: string
  }
  notification: {
    close: string
  }
  form: {
    required: string
    min: string
    max: string
    invalid: string
    invalidFormat: string
  }
  input: {
    clear: string
    showPassword: string
    hidePassword: string
  }
  tag: {
    close: string
  }
}
