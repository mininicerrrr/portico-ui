import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { PtDialog } from '../src/components/dialog'

describe('PtDialog', () => {
  it('toggles visibility with v-model', async () => {
    const wrapper = mount(PtDialog, {
      props: { modelValue: false, title: 'Confirm' },
      slots: { default: 'Body copy', footer: 'Actions' },
      attachTo: document.body
    })
    expect(document.body.querySelector('.pt-dialog')).toBeNull()

    await wrapper.setProps({ modelValue: true })
    await nextTick()
    const dialog = document.body.querySelector('.pt-dialog')
    expect(dialog).toBeTruthy()
    expect(dialog?.textContent).toContain('Confirm')
    expect(dialog?.textContent).toContain('Body copy')
    expect(dialog?.textContent).toContain('Actions')
    expect(dialog?.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true')

    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeNull()
    wrapper.unmount()
  })

  it('closes on Escape and emits update:modelValue', async () => {
    const wrapper = mount(PtDialog, {
      props: { modelValue: true, title: 'Title' },
      slots: { default: 'Content' },
      attachTo: document.body
    })
    await nextTick()
    const root = document.body.querySelector('.pt-dialog') as HTMLElement
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes when the close button is clicked', async () => {
    const wrapper = mount(PtDialog, {
      props: { modelValue: true, title: 'Title' },
      attachTo: document.body
    })
    await nextTick()
    const close = document.body.querySelector('.pt-dialog__close') as HTMLButtonElement
    close.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})
