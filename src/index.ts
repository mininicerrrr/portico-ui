import { ref, type App, type Plugin } from 'vue'
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
import { PtTextarea } from './components/textarea'
import { PtInputNumber } from './components/input-number'
import { PtBadge } from './components/badge'
import { PtEmpty } from './components/empty'
import { PtSkeleton } from './components/skeleton'
import { PtAlert } from './components/alert'
import { PtPagination } from './components/pagination'
import { PtTooltip } from './components/tooltip'
import { PtPopconfirm } from './components/popconfirm'
import { PtDropdown, PtDropdownItem } from './components/dropdown'
import { PtBreadcrumb, PtBreadcrumbItem } from './components/breadcrumb'
import { PtTabs, PtTabPane } from './components/tabs'
import { PtMenu, PtMenuItem, PtSubMenu } from './components/menu'
import { PtDrawer } from './components/drawer'
import { notify } from './components/notification'
import { PtDatePicker } from './components/date-picker'
import { PtUpload } from './components/upload'
import { PtConfigProvider } from './components/config-provider'
import { localeContextKey, zhCN, type PtLocale } from './locale'

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
  PtTable,
  PtTextarea,
  PtInputNumber,
  PtBadge,
  PtEmpty,
  PtSkeleton,
  PtAlert,
  PtPagination,
  PtTooltip,
  PtPopconfirm,
  PtDropdown,
  PtDropdownItem,
  PtBreadcrumb,
  PtBreadcrumbItem,
  PtTabs,
  PtTabPane,
  PtMenu,
  PtMenuItem,
  PtSubMenu,
  PtDrawer,
  PtDatePicker,
  PtUpload,
  PtConfigProvider
]

export interface PorticoUIOptions {
  locale?: PtLocale
}

export const PorticoUI: Plugin = {
  install(app: App, options?: PorticoUIOptions) {
    components.forEach((component) => {
      if (component.name) app.component(component.name, component)
    })
    app.provide(localeContextKey, ref(options?.locale ?? zhCN))
    app.config.globalProperties.$message = message
    app.config.globalProperties.$notify = notify
  }
}

export default PorticoUI

export { PtButton } from './components/button'
export type { ButtonProps, ButtonType, ButtonSize } from './components/button'
export { PtInput } from './components/input'
export type { InputProps, InputSize } from './components/input'
export { PtSelect, PtOption } from './components/select'
export type { SelectProps, SelectSize, SelectValue, OptionProps, SelectOptionData } from './components/select'
export { PtCheckbox, PtCheckboxGroup } from './components/checkbox'
export type { CheckboxProps, CheckboxGroupProps } from './components/checkbox'
export { PtRadio, PtRadioGroup } from './components/radio'
export type { RadioProps, RadioGroupProps } from './components/radio'
export { PtSwitch } from './components/switch'
export type { SwitchProps } from './components/switch'
export { PtForm, PtFormItem } from './components/form'
export type { FormProps, FormItemProps, FormRule, FormRules, FormValidateCallback, FormValidationError } from './components/form'
export type { FormValidateStatus } from './components/form/tokens'
export { PtDialog } from './components/dialog'
export type { DialogProps, DialogSize } from './components/dialog'
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
export type { TableProps, TableColumn, TableSortOrder } from './components/table'
export { PtTextarea } from './components/textarea'
export type { TextareaProps, TextareaAutosize } from './components/textarea'
export { PtInputNumber } from './components/input-number'
export type { InputNumberProps, InputNumberSize } from './components/input-number'
export { PtBadge } from './components/badge'
export type { BadgeProps, BadgeType } from './components/badge'
export { PtEmpty } from './components/empty'
export type { EmptyProps } from './components/empty'
export { PtSkeleton } from './components/skeleton'
export type { SkeletonProps, SkeletonVariant } from './components/skeleton'
export { PtAlert } from './components/alert'
export type { AlertProps, AlertType } from './components/alert'
export { PtPagination } from './components/pagination'
export type { PaginationProps, PaginationSize } from './components/pagination'
export { PtTooltip } from './components/tooltip'
export type { TooltipProps, TooltipEffect } from './components/tooltip'
export { PtPopconfirm } from './components/popconfirm'
export type { PopconfirmProps } from './components/popconfirm'
export { PtDropdown, PtDropdownItem } from './components/dropdown'
export type { DropdownProps, DropdownItemProps } from './components/dropdown'
export { PtBreadcrumb, PtBreadcrumbItem } from './components/breadcrumb'
export type { BreadcrumbProps, BreadcrumbItemData, BreadcrumbItemProps } from './components/breadcrumb'
export { PtTabs, PtTabPane } from './components/tabs'
export type { TabsProps, TabsType, TabPaneProps } from './components/tabs'
export { PtMenu, PtMenuItem, PtSubMenu } from './components/menu'
export type { MenuProps, MenuMode, MenuItemProps, SubMenuProps } from './components/menu'
export { PtDrawer } from './components/drawer'
export type { DrawerProps, DrawerPlacement } from './components/drawer'
export { notify, closeNotificationHost } from './components/notification'
export type { NotifyApi, NotificationOptions, NotificationType, NotificationPosition, NotificationHandler } from './components/notification'
export { PtDatePicker } from './components/date-picker'
export type { DatePickerProps, DatePickerType, DatePickerSize, DatePickerValue } from './components/date-picker'
export { PtUpload } from './components/upload'
export type { UploadProps, UploadFile, UploadHttpRequest, UploadRequestOptions, UploadStatus } from './components/upload'
export { PtConfigProvider } from './components/config-provider'
export type { ConfigProviderProps } from './components/config-provider'
export { zhCN, en, useLocale, localeContextKey } from './locale'
export type { PtLocale } from './locale'
