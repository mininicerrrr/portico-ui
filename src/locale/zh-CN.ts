import type { PtLocale } from './types'

export const zhCN: PtLocale = {
  locale: 'zh-CN',
  select: {
    placeholder: '请选择',
    loadingText: '加载中…',
    noMatchText: '无匹配选项',
    noDataText: '暂无数据',
    clear: '清除'
  },
  table: {
    emptyText: '暂无数据',
    loadingText: '加载中…'
  },
  pagination: {
    total: '共 {total} 条',
    sizes: '{n} 条/页',
    jumper: '跳至',
    page: '页'
  },
  datePicker: {
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    today: '今天',
    year: '年',
    month: '月',
    placeholder: '选择日期',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期'
  },
  upload: {
    drag: '将文件拖到此处，或点击上传',
    exceed: '超出上传数量限制',
    retry: '重试',
    fileTooLarge: '文件过大'
  },
  empty: {
    description: '暂无数据'
  },
  dialog: {
    confirm: '确定',
    cancel: '取消',
    close: '关闭'
  },
  drawer: {
    close: '关闭'
  },
  popconfirm: {
    confirm: '确定',
    cancel: '取消',
    delete: '删除'
  },
  message: {
    close: '关闭'
  },
  notification: {
    close: '关闭'
  },
  form: {
    required: '该项为必填项',
    min: '至少输入 {min} 个字符',
    max: '最多输入 {max} 个字符',
    invalid: '输入值无效',
    invalidFormat: '格式不正确'
  },
  input: {
    clear: '清除',
    showPassword: '显示密码',
    hidePassword: '隐藏密码'
  },
  tag: {
    close: '移除'
  }
}

export default zhCN
