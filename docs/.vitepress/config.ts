import { defineConfig, type DefaultTheme } from 'vitepress'
import { resolve } from 'node:path'

const zhNav: DefaultTheme.NavItem[] = [
  { text: '指南', link: '/guide/installation' },
  { text: '组件', link: '/components/button' }
]

const enNav: DefaultTheme.NavItem[] = [
  { text: 'Guide', link: '/en/guide/installation' },
  { text: 'Components', link: '/en/components/button' }
]

const zhSidebar: DefaultTheme.Sidebar = {
  '/': [
    {
      text: '指南',
      items: [
        { text: '安装', link: '/guide/installation' },
        { text: '快速开始', link: '/guide/quickstart' },
        { text: '设计变量', link: '/guide/theme' },
        { text: 'Visual v2 验证', link: '/guide/visual-v2' },
        { text: '国际化', link: '/guide/i18n' }
      ]
    },
    {
      text: '组件',
      items: [
        { text: 'Button 按钮', link: '/components/button' },
        { text: 'Input 输入框', link: '/components/input' },
        { text: 'Textarea 文本域', link: '/components/textarea' },
        { text: 'InputNumber 数字输入', link: '/components/input-number' },
        { text: 'Select 选择器', link: '/components/select' },
        { text: 'Checkbox 复选框', link: '/components/checkbox' },
        { text: 'Radio 单选框', link: '/components/radio' },
        { text: 'Switch 开关', link: '/components/switch' },
        { text: 'Form 表单', link: '/components/form' },
        { text: 'DatePicker 日期选择', link: '/components/date-picker' },
        { text: 'Upload 上传', link: '/components/upload' },
        { text: 'Dialog 对话框', link: '/components/dialog' },
        { text: 'Drawer 抽屉', link: '/components/drawer' },
        { text: 'Message 消息', link: '/components/message' },
        { text: 'Notification 通知', link: '/components/notification' },
        { text: 'Tooltip 文字提示', link: '/components/tooltip' },
        { text: 'Popconfirm 气泡确认', link: '/components/popconfirm' },
        { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
        { text: 'Tag 标签', link: '/components/tag' },
        { text: 'Badge 徽标', link: '/components/badge' },
        { text: 'Card 卡片', link: '/components/card' },
        { text: 'Space 间距', link: '/components/space' },
        { text: 'Divider 分割线', link: '/components/divider' },
        { text: 'Table 表格', link: '/components/table' },
        { text: 'Pagination 分页', link: '/components/pagination' },
        { text: 'Empty 空状态', link: '/components/empty' },
        { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
        { text: 'Alert 警告', link: '/components/alert' },
        { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
        { text: 'Tabs 标签页', link: '/components/tabs' },
        { text: 'Menu 菜单', link: '/components/menu' }
      ]
    }
  ]
}

const enSidebar: DefaultTheme.Sidebar = {
  '/en/': [
    {
      text: 'Guide',
      items: [
        { text: 'Installation', link: '/en/guide/installation' },
        { text: 'Quick start', link: '/en/guide/quickstart' },
        { text: 'Design tokens', link: '/en/guide/theme' },
        { text: 'Visual v2 verification', link: '/en/guide/visual-v2' },
        { text: 'Internationalization', link: '/en/guide/i18n' }
      ]
    },
    {
      text: 'Components',
      items: [
        { text: 'Button', link: '/en/components/button' },
        { text: 'Input', link: '/en/components/input' },
        { text: 'Textarea', link: '/en/components/textarea' },
        { text: 'InputNumber', link: '/en/components/input-number' },
        { text: 'Select', link: '/en/components/select' },
        { text: 'Checkbox', link: '/en/components/checkbox' },
        { text: 'Radio', link: '/en/components/radio' },
        { text: 'Switch', link: '/en/components/switch' },
        { text: 'Form', link: '/en/components/form' },
        { text: 'DatePicker', link: '/en/components/date-picker' },
        { text: 'Upload', link: '/en/components/upload' },
        { text: 'Dialog', link: '/en/components/dialog' },
        { text: 'Drawer', link: '/en/components/drawer' },
        { text: 'Message', link: '/en/components/message' },
        { text: 'Notification', link: '/en/components/notification' },
        { text: 'Tooltip', link: '/en/components/tooltip' },
        { text: 'Popconfirm', link: '/en/components/popconfirm' },
        { text: 'Dropdown', link: '/en/components/dropdown' },
        { text: 'Tag', link: '/en/components/tag' },
        { text: 'Badge', link: '/en/components/badge' },
        { text: 'Card', link: '/en/components/card' },
        { text: 'Space', link: '/en/components/space' },
        { text: 'Divider', link: '/en/components/divider' },
        { text: 'Table', link: '/en/components/table' },
        { text: 'Pagination', link: '/en/components/pagination' },
        { text: 'Empty', link: '/en/components/empty' },
        { text: 'Skeleton', link: '/en/components/skeleton' },
        { text: 'Alert', link: '/en/components/alert' },
        { text: 'Breadcrumb', link: '/en/components/breadcrumb' },
        { text: 'Tabs', link: '/en/components/tabs' },
        { text: 'Menu', link: '/en/components/menu' }
      ]
    }
  ]
}

export default defineConfig({
  title: 'Portico UI',
  description: 'A compact Vue 3 component library for practical admin and form interfaces.',
  base: '/portico-ui/',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        outline: { label: '本页目录' },
        lastUpdated: { text: '最后更新' },
        docFooter: { prev: '上一页', next: '下一页' },
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        darkModeSwitchLabel: '主题',
        socialLinks: [{ icon: 'github', link: 'https://github.com/mininicerrrr/portico-ui' }]
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/mininicerrrr/portico-ui' }]
      }
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Portico UI',
    search: { provider: 'local' }
  },
  vite: {
    base: '/portico-ui/',
    resolve: {
      alias: {
        'portico-ui': resolve(import.meta.dirname, '../../src/index.ts')
      }
    },
    server: { fs: { allow: [resolve(import.meta.dirname, '../..')] } },
    preview: { port: 4173, strictPort: true }
  }
})
