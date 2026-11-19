import { createApp, type App } from 'vue'
import MessageHost from './MessageHost.vue'
import { addMessage, clearMessages, removeMessage, messageTypes } from './store'
import type { MessageApi, MessageHandler, MessageOptions, MessageType } from './types'

let hostApp: App | null = null
let hostEl: HTMLElement | null = null

function ensureHost(): void {
  if (hostApp || typeof document === 'undefined') return
  hostEl = document.createElement('div')
  hostEl.className = 'pt-message-anchor'
  document.body.appendChild(hostEl)
  hostApp = createApp(MessageHost)
  hostApp.mount(hostEl)
}

export function closeMessageHost(): void {
  hostApp?.unmount()
  hostApp = null
  hostEl?.remove()
  hostEl = null
  clearMessages()
}

function normalize(options: string | MessageOptions, type?: MessageType): MessageOptions {
  const base = typeof options === 'string' ? { message: options } : { ...options }
  if (type) base.type = type
  return base
}

function open(options: string | MessageOptions, type?: MessageType): MessageHandler {
  const opts = normalize(options, type)
  ensureHost()
  const id = addMessage(opts)
  return { close: () => removeMessage(id) }
}

export const message: MessageApi = Object.assign(open, {
  success: (options: string | Omit<MessageOptions, 'type'>) => open(options, 'success'),
  warning: (options: string | Omit<MessageOptions, 'type'>) => open(options, 'warning'),
  info: (options: string | Omit<MessageOptions, 'type'>) => open(options, 'info'),
  error: (options: string | Omit<MessageOptions, 'type'>) => open(options, 'error'),
  closeAll: () => clearMessages()
})

export { messageTypes }
