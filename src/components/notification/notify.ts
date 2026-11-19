import { createApp, type App } from 'vue'
import NotificationHost from './NotificationHost.vue'
import { addNotification, clearNotifications, removeNotification } from './store'
import type { NotificationOptions, NotificationHandler, NotifyApi, NotificationType } from './types'

let hostApp: App | null = null
let hostEl: HTMLElement | null = null

function ensureHost(): void {
  if (hostApp || typeof document === 'undefined') return
  hostEl = document.createElement('div')
  hostEl.className = 'pt-notification-anchor'
  document.body.appendChild(hostEl)
  hostApp = createApp(NotificationHost)
  hostApp.mount(hostEl)
}

export function closeNotificationHost(): void {
  hostApp?.unmount()
  hostApp = null
  hostEl?.remove()
  hostEl = null
  clearNotifications()
}

function normalize(options: string | NotificationOptions, type?: NotificationType): NotificationOptions {
  const base = typeof options === 'string' ? { message: options } : { ...options }
  if (type) base.type = type
  return base
}

function open(options: string | NotificationOptions, type?: NotificationType): NotificationHandler {
  const opts = normalize(options, type)
  ensureHost()
  const id = addNotification(opts)
  return { close: () => removeNotification(id) }
}

export const notify: NotifyApi = Object.assign(open, {
  success: (options: string | NotificationOptions) => open(options, 'success'),
  warning: (options: string | NotificationOptions) => open(options, 'warning'),
  info: (options: string | NotificationOptions) => open(options, 'info'),
  error: (options: string | NotificationOptions) => open(options, 'error'),
  closeAll: () => clearNotifications()
})
