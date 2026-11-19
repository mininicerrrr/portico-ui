import { reactive } from 'vue'
import type { NotificationOptions, NotificationPosition, NotificationType } from './types'

export interface NotificationRecord extends Required<Pick<NotificationOptions, 'title' | 'message' | 'type' | 'duration' | 'position' | 'showClose'>> {
  id: number
  onClose?: () => void
}

const items = reactive<NotificationRecord[]>([])
let seed = 0

export const notificationState = { items }

export function addNotification(options: NotificationOptions): number {
  seed += 1
  const id = seed
  items.push({
    id,
    title: options.title ?? '',
    message: options.message ?? '',
    type: (options.type ?? 'info') as NotificationType,
    duration: options.duration ?? 4500,
    position: (options.position ?? 'top-right') as NotificationPosition,
    showClose: options.showClose ?? true,
    onClose: options.onClose
  })
  return id
}

export function removeNotification(id: number): void {
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return
  const [item] = items.splice(index, 1)
  item.onClose?.()
}

export function clearNotifications(): void {
  items.forEach((item) => item.onClose?.())
  items.splice(0, items.length)
}
