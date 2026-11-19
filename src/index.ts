import type { App, Plugin } from 'vue'
import './styles/index.css'

import { PtButton } from './components/button'
import { PtInput } from './components/input'
import { PtSelect, PtOption } from './components/select'
import { PtCheckbox, PtCheckboxGroup } from './components/checkbox'
import { PtRadio, PtRadioGroup } from './components/radio'
import { PtSwitch } from './components/switch'
import { PtForm, PtFormItem } from './components/form'
import { PtDialog } from './components/dialog'
import { PtTag } from './components/tag'
import { PtCard } from './components/card'
import { PtSpace } from './components/space'
import { PtDivider } from './components/divider'
import { PtTable } from './components/table'
import { message } from './components/message'

export const components = [
  PtButton,
  PtInput,
  PtSelect,
  PtOption,
  PtCheckbox,
  PtCheckboxGroup,
  PtRadio,
  PtRadioGroup,
  PtSwitch,
  PtForm,
  PtFormItem,
  PtDialog,
  PtTag,
  PtCard,
  PtSpace,
  PtDivider,
  PtTable
]

export const PorticoUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      if (component.name) app.component(component.name, component)
    })
    app.config.globalProperties.$message = message
  }
}

export default PorticoUI

export { PtButton } from './components/button'
export type { ButtonProps, ButtonType, ButtonSize } from './components/button'
export { PtInput } from './components/input'
export type { InputProps, InputSize } from './components/input'
export { PtSelect, PtOption } from './components/select'
export type { SelectProps, SelectSize, OptionProps, SelectOptionData } from './components/select'
export { PtCheckbox, PtCheckboxGroup } from './components/checkbox'
export type { CheckboxProps, CheckboxGroupProps } from './components/checkbox'
export { PtRadio, PtRadioGroup } from './components/radio'
export type { RadioProps, RadioGroupProps } from './components/radio'
export { PtSwitch } from './components/switch'
export type { SwitchProps } from './components/switch'
export { PtForm, PtFormItem } from './components/form'
export type { FormProps, FormItemProps, FormRule, FormRules, FormValidateCallback, FormValidationError } from './components/form'
export { PtDialog } from './components/dialog'
export type { DialogProps } from './components/dialog'
export { message, closeMessageHost } from './components/message'
export type { MessageApi, MessageOptions, MessageType, MessageHandler } from './components/message'
export { PtTag } from './components/tag'
export type { TagProps, TagType, TagEffect, TagSize } from './components/tag'
export { PtCard } from './components/card'
export type { CardProps, CardShadow } from './components/card'
export { PtSpace } from './components/space'
export type { SpaceProps, SpaceSize } from './components/space'
export { PtDivider } from './components/divider'
export type { DividerProps } from './components/divider'
export { PtTable } from './components/table'
export type { TableProps, TableColumn } from './components/table'
