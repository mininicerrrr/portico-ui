import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { message, closeMessageHost } from '../src/components/message'

describe('message API', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    closeMessageHost()
    vi.useRealTimers()
  })

  it('renders an imperative success message', async () => {
    message.success('Saved successfully')
    await nextTick()
    const node = document.body.querySelector('.pt-message--success')
    expect(node).toBeTruthy()
    expect(node?.textContent).toContain('Saved successfully')
  })

  it('supports type helpers and auto dismiss', async () => {
    message.error('Broken')
    await nextTick()
    expect(document.body.querySelector('.pt-message--error')?.textContent).toContain('Broken')
    vi.advanceTimersByTime(3000)
    await nextTick()
    expect(document.body.querySelector('.pt-message--error')).toBeNull()
  })

  it('closeAll removes every visible message', async () => {
    message.info('One')
    message.warning('Two')
    await nextTick()
    expect(document.body.querySelectorAll('.pt-message').length).toBe(2)
    message.closeAll()
    await nextTick()
    expect(document.body.querySelectorAll('.pt-message').length).toBe(0)
  })

  it('keeps a message with duration 0 until it is closed', async () => {
    const closed: string[] = []
    const handler = message.info({ message: 'Pinned', duration: 0, showClose: true, onClose: () => closed.push('yes') })
    await nextTick()
    vi.advanceTimersByTime(10_000)
    await nextTick()
    expect(document.body.querySelector('.pt-message--info')).toBeTruthy()
    handler.close()
    await nextTick()
    expect(document.body.querySelector('.pt-message--info')).toBeNull()
    expect(closed).toEqual(['yes'])
  })

  it('uses an alert role for error messages', async () => {
    message.error('Broken')
    await nextTick()
    expect(document.body.querySelector('.pt-message--error')?.getAttribute('role')).toBe('alert')
  })
})
