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
        { text: '设计变量', link: '/guide/theme' }
      ]
    },
    {
      text: '组件',
      items: [
        { text: 'Button 按钮', link: '/components/button' },
        { text: 'Input 输入框', link: '/components/input' },
        { text: 'Select 选择器', link: '/components/select' },
        { text: 'Checkbox 复选框', link: '/components/checkbox' },
        { text: 'Radio 单选框', link: '/components/radio' },
        { text: 'Switch 开关', link: '/components/switch' },
        { text: 'Form 表单', link: '/components/form' },
        { text: 'Dialog 对话框', link: '/components/dialog' },
        { text: 'Message 消息', link: '/components/message' },
        { text: 'Tag 标签', link: '/components/tag' },
        { text: 'Card 卡片', link: '/components/card' },
        { text: 'Space 间距', link: '/components/space' },
        { text: 'Divider 分割线', link: '/components/divider' },
        { text: 'Table 表格', link: '/components/table' }
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
        { text: 'Design tokens', link: '/en/guide/theme' }
      ]
    },
    {
      text: 'Components',
      items: [
        { text: 'Button', link: '/en/components/button' },
        { text: 'Input', link: '/en/components/input' },
        { text: 'Select', link: '/en/components/select' },
        { text: 'Checkbox', link: '/en/components/checkbox' },
        { text: 'Radio', link: '/en/components/radio' },
        { text: 'Switch', link: '/en/components/switch' },
        { text: 'Form', link: '/en/components/form' },
        { text: 'Dialog', link: '/en/components/dialog' },
        { text: 'Message', link: '/en/components/message' },
        { text: 'Tag', link: '/en/components/tag' },
        { text: 'Card', link: '/en/components/card' },
        { text: 'Space', link: '/en/components/space' },
        { text: 'Divider', link: '/en/components/divider' },
        { text: 'Table', link: '/en/components/table' }
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
    resolve: {
      alias: {
        'portico-ui': resolve(import.meta.dirname, '../../src/index.ts')
      }
    },
    server: { fs: { allow: [resolve(import.meta.dirname, '../..')] } }
  }
})
