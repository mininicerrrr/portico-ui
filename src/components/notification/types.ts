export type NotificationType = 'success' | 'warning' | 'info' | 'error'
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface NotificationOptions {
  title?: string
  message?: string
  type?: NotificationType
  duration?: number
  position?: NotificationPosition
  showClose?: boolean
  onClose?: () => void
}

export interface NotificationHandler {
  close: () => void
}

export interface NotifyApi {
  (options: NotificationOptions): NotificationHandler
  success: (options: NotificationOptions | string) => NotificationHandler
  warning: (options: NotificationOptions | string) => NotificationHandler
  info: (options: NotificationOptions | string) => NotificationHandler
  error: (options: NotificationOptions | string) => NotificationHandler
  closeAll: () => void
}
