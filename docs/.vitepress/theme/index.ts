import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PorticoUI from '../../../src'
import '../../../src/styles/index.css'
import DemoBox from './DemoBox.vue'
import './custom.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(PorticoUI)
    app.component('DemoBox', DemoBox)
  }
}

export default theme
