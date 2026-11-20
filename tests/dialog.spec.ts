import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
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

  it('hides and disables pointer events on the root after close', async () => {
    const wrapper = mount(PtDialog, {
      props: { modelValue: true, title: 'Title' },
      attachTo: document.body
    })
    await nextTick()
    const root = document.body.querySelector('.pt-dialog') as HTMLElement
    expect(root.classList.contains('is-visible')).toBe(true)

    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(root.classList.contains('is-visible')).toBe(false)
    expect(getComputedStyle(root).pointerEvents).toBe('none')
    expect(getComputedStyle(root).visibility).toBe('hidden')
    wrapper.unmount()
  })

  function escapeFromFocusedInDialog(wrapper: ReturnType<typeof mount>) {
    const panel = document.body.querySelector('.pt-dialog__panel') as HTMLElement
    const footerBtn = panel.querySelector('.pt-dialog__footer button') as HTMLButtonElement | null
    const target = footerBtn || panel
    target.focus()
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    return wrapper
  }

  it('closes on Escape from a focused control inside the panel', async () => {
    const wrapper = mount(PtDialog, {
      props: {
        modelValue: true,
        title: 'Title',
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
      },
      slots: {
        default: 'Content',
        footer: '<button type="button">确定</button>'
      },
      attachTo: document.body
    })
    await nextTick()
    escapeFromFocusedInDialog(wrapper)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeNull()
    wrapper.unmount()
  })

  it('does not close on Escape when closeOnPressEscape is false', async () => {
    const wrapper = mount(PtDialog, {
      props: { modelValue: true, title: 'Title', closeOnPressEscape: false },
      slots: { footer: '<button type="button">确定</button>' },
      attachTo: document.body
    })
    await nextTick()
    escapeFromFocusedInDialog(wrapper)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('does not close when a slot control stops Escape propagation', async () => {
    const wrapper = mount(PtDialog, {
      props: {
        modelValue: true,
        title: 'Title',
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
      },
      slots: {
        default: defineComponent({
          setup() {
            return () =>
              h('input', {
                class: 'inner-field',
                onKeydown: (event: KeyboardEvent) => {
                  if (event.key === 'Escape') event.stopPropagation()
                }
              })
          }
        })
      },
      attachTo: document.body
    })
    await nextTick()
    const field = document.body.querySelector('.inner-field') as HTMLInputElement
    field.focus()
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeTruthy()
    wrapper.unmount()
  })

  it('closes only the top dialog when two instances are open', async () => {
    const first = mount(PtDialog, {
      props: {
        modelValue: true,
        title: '下层',
        'onUpdate:modelValue': (v: boolean) => first.setProps({ modelValue: v })
      },
      attachTo: document.body
    })
    const second = mount(PtDialog, {
      props: {
        modelValue: true,
        title: '上层',
        'onUpdate:modelValue': (v: boolean) => second.setProps({ modelValue: v })
      },
      attachTo: document.body
    })
    await nextTick()
    expect(document.body.querySelectorAll('.pt-dialog.is-visible').length).toBe(2)

    const topClose = document.body.querySelectorAll('.pt-dialog__close')[1] as HTMLButtonElement
    topClose.focus()
    topClose.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(second.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(first.emitted('update:modelValue')).toBeUndefined()
    expect(first.props('modelValue')).toBe(true)
    expect(document.body.querySelectorAll('.pt-dialog.is-visible').length).toBe(1)
    first.unmount()
    second.unmount()
  })

  it('closes when the overlay is clicked and respects closeOnClickModal', async () => {
    const wrapper = mount(PtDialog, {
      props: {
        modelValue: true,
        title: 'Title',
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
      },
      attachTo: document.body
    })
    await nextTick()
    ;(document.body.querySelector('.pt-dialog__overlay') as HTMLElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeNull()

    await wrapper.setProps({ modelValue: true, closeOnClickModal: false })
    await nextTick()
    ;(document.body.querySelector('.pt-dialog__overlay') as HTMLElement).click()
    await nextTick()
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeTruthy()
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

  async function mountControlledDialog(trigger: HTMLButtonElement) {
    const wrapper = mount(PtDialog, {
      props: {
        modelValue: false,
        title: '确认操作',
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
      },
      slots: {
        footer:
          '<button type="button" class="dlg-cancel">取消</button><button type="button" class="dlg-ok">确定</button>'
      },
      attachTo: document.body
    })
    trigger.focus()
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeTruthy()
    return wrapper
  }

  it.each([
    [
      'Escape',
      async () => {
        const footer = document.body.querySelector('.pt-dialog__footer button') as HTMLButtonElement
        footer.focus()
        footer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      }
    ],
    [
      'header close',
      async () => {
        ;(document.body.querySelector('.pt-dialog__close') as HTMLButtonElement).click()
      }
    ],
    [
      'overlay',
      async () => {
        ;(document.body.querySelector('.pt-dialog__overlay') as HTMLElement).click()
      }
    ]
  ])('syncs v-model, dismisses UI, and returns focus after %s', async (_label, dismiss) => {
    const trigger = document.createElement('button')
    trigger.textContent = '打开对话框'
    document.body.appendChild(trigger)
    const wrapper = await mountControlledDialog(trigger)

    await dismiss()
    await nextTick()
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeNull()
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
    wrapper.unmount()
  })

  it('reopens after closing with the header close button when v-model updates', async () => {
    const wrapper = mount(PtDialog, {
      props: {
        modelValue: true,
        title: '确认操作',
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
      },
      attachTo: document.body
    })
    await nextTick()
    ;(document.body.querySelector('.pt-dialog__close') as HTMLButtonElement).click()
    await nextTick()
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeNull()
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(document.body.querySelector('.pt-dialog.is-visible')).toBeTruthy()
    wrapper.unmount()
  })

  it('maps size to official widths and lets width override', async () => {
    const small = mount(PtDialog, {
      props: { modelValue: true, title: 'S', size: 'small' },
      attachTo: document.body
    })
    await nextTick()
    expect((document.body.querySelector('.pt-dialog__panel') as HTMLElement).style.width).toBe('360px')
    small.unmount()

    const large = mount(PtDialog, {
      props: { modelValue: true, title: 'L', size: 'large' },
      attachTo: document.body
    })
    await nextTick()
    expect((document.body.querySelector('.pt-dialog__panel') as HTMLElement).style.width).toBe('640px')
    large.unmount()

    const custom = mount(PtDialog, {
      props: { modelValue: true, title: 'C', size: 'small', width: '720px' },
      attachTo: document.body
    })
    await nextTick()
    expect((document.body.querySelector('.pt-dialog__panel') as HTMLElement).style.width).toBe('720px')
    custom.unmount()
  })
})