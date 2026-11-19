export type MessageType = 'success' | 'warning' | 'info' | 'error'

export interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  id?: string
  onClose?: () => void
}

export interface MessageHandler {
  close: () => void
}

export interface MessageApi {
  (options: string | MessageOptions): MessageHandler
  success: (options: string | Omit<MessageOptions, 'type'>) => MessageHandler
  warning: (options: string | Omit<MessageOptions, 'type'>) => MessageHandler
  info: (options: string | Omit<MessageOptions, 'type'>) => MessageHandler
  error: (options: string | Omit<MessageOptions, 'type'>) => MessageHandler
  closeAll: () => void
}
