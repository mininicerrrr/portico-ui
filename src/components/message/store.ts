import { reactive } from 'vue'
import type { MessageOptions, MessageType } from './types'

export interface MessageRecord extends Required<Pick<MessageOptions, 'message' | 'type' | 'duration' | 'showClose'>> {
  id: number
  onClose?: () => void
}

export const messageState = reactive({
  items: [] as MessageRecord[]
})

let seed = 0

export function addMessage(options: MessageOptions): number {
  const id = ++seed
  messageState.items.push({
    id,
    message: options.message,
    type: options.type || 'info',
    duration: options.duration ?? 3000,
    showClose: options.showClose ?? false,
    onClose: options.onClose
  })
  return id
}

export function removeMessage(id: number): void {
  const index = messageState.items.findIndex((item) => item.id === id)
  if (index === -1) return
  const [item] = messageState.items.splice(index, 1)
  item.onClose?.()
}

export function clearMessages(): void {
  const items = [...messageState.items]
  messageState.items.splice(0, messageState.items.length)
  items.forEach((item) => item.onClose?.())
}

export const messageTypes: MessageType[] = ['success', 'warning', 'info', 'error']
