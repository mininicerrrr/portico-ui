import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PorticoUI, {
  PtAlert,
  PtBadge,
  PtEmpty,
  PtInputNumber,
  PtPagination,
  PtTabs,
  PtTabPane,
  PtTextarea,
  PtUpload,
  notify,
  closeNotificationHost
} from '../src'

describe('new v1 components', () => {
  it('autosizes and counts words on PtTextarea', async () => {
    const wrapper = mount(PtTextarea, { props: { modelValue: 'hi', maxlength: 10, showWordLimit: true } })
    expect(wrapper.get('.pt-textarea__count').text()).toBe('2 / 10')
    await wrapper.get('textarea').setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('steps PtInputNumber and clamps to min/max', async () => {
    const wrapper = mount(PtInputNumber, { props: { modelValue: 2, min: 0, max: 3, step: 1 } })
    await wrapper.get('.is-plus').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    await wrapper.setProps({ modelValue: 3 })
    await wrapper.get('.is-plus').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toBeUndefined()
    await wrapper.get('.is-minus').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([2])
  })

  it('caps PtBadge values and can hide or show a dot', async () => {
    const wrapper = mount(PtBadge, { props: { value: 120, max: 99 }, slots: { default: 'Inbox' } })
    expect(wrapper.get('.pt-badge__content').text()).toBe('99+')
    await wrapper.setProps({ isDot: true })
    expect(wrapper.get('.pt-badge__content').classes()).toContain('is-dot')
    await wrapper.setProps({ hidden: true })
    expect(wrapper.find('.pt-badge__content').exists()).toBe(false)
  })

  it('uses locale fallback copy on PtEmpty', () => {
    const wrapper = mount(PtEmpty)
    expect(wrapper.get('.pt-empty__description').text()).toBe('暂无数据')
  })

  it('closes PtAlert and emits close', async () => {
    const wrapper = mount(PtAlert, { props: { title: 'Heads up', type: 'warning' } })
    expect(wrapper.get('.pt-alert__title').text()).toBe('Heads up')
    await wrapper.get('.pt-alert__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.find('.pt-alert').exists()).toBe(false)
  })

  it('paginates and updates page size', async () => {
    const wrapper = mount(PtPagination, { props: { total: 95, currentPage: 1, pageSize: 10, background: true } })
    expect(wrapper.text()).toContain('共 95 条')
    await wrapper.findAll('.pt-pagination__pager .pt-pagination__btn').find((btn) => btn.text() === '3')!.trigger('click')
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([3])
    expect(wrapper.emitted('change')?.[0]).toEqual([3, 10])
    await wrapper.get('.pt-pagination__sizes select').setValue('20')
    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([20])
  })

  it('switches PtTabs panes', async () => {
    const wrapper = mount(
      {
        components: { PtTabs, PtTabPane },
        template: `
          <pt-tabs v-model="active">
            <pt-tab-pane label="One" name="one">First</pt-tab-pane>
            <pt-tab-pane label="Two" name="two">Second</pt-tab-pane>
          </pt-tabs>
        `,
        data: () => ({ active: 'one' })
      }
    )
    await nextTick()
    expect(wrapper.text()).toContain('First')
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    expect((wrapper.vm as unknown as { active: string }).active).toBe('two')
  })

  it('uploads through a custom httpRequest', async () => {
    const httpRequest = vi.fn(({ onSuccess }) => onSuccess({ ok: true }))
    const wrapper = mount(PtUpload, { props: { httpRequest, autoUpload: true } })
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' })
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file] })
    await wrapper.get('input[type="file"]').trigger('change')
    await nextTick()
    expect(httpRequest).toHaveBeenCalled()
    expect(wrapper.emitted('onSuccess')?.[0][0]).toEqual({ ok: true })
    expect(wrapper.get('.pt-upload__name').text()).toBe('notes.txt')
  })

  it('shows notify() toasts', async () => {
    notify({ title: 'Saved', message: 'All good', type: 'success', duration: 0 })
    await nextTick()
    expect(document.body.textContent).toContain('Saved')
    expect(document.body.textContent).toContain('All good')
    closeNotificationHost()
  })
})
