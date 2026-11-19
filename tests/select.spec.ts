import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { PtSelect, PtOption } from '../src/components/select'

const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Vite', value: 'vite', disabled: true }
]

describe('PtSelect', () => {
  it('opens the listbox and selects an option', async () => {
    const wrapper = mount(PtSelect, {
      props: { modelValue: null, options, placeholder: 'Pick one' },
      attachTo: document.body
    })
    const control = wrapper.get('[role="combobox"]')
    expect(control.text()).toContain('Pick one')
    expect(control.attributes('aria-expanded')).toBe('false')

    await control.trigger('click')
    await nextTick()
    expect(control.attributes('aria-expanded')).toBe('true')
    const listbox = wrapper.get('[role="listbox"]')
    expect(listbox.isVisible()).toBe(true)
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3)

    await wrapper.findAll('[role="option"]')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ts'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['ts'])
    wrapper.unmount()
  })

  it('supports keyboard highlight and confirmation without changing the value on arrow keys', async () => {
    const wrapper = mount(PtSelect, {
      props: { modelValue: 'vue', options },
      attachTo: document.body
    })
    const control = wrapper.get('[role="combobox"]')
    await control.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(control.attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(control.attributes('aria-activedescendant')).toBeTruthy()

    await control.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(wrapper.get('.is-highlighted').text()).toBe('TypeScript')

    await control.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ts'])
    expect(control.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('clears the value and honors the disabled state', async () => {
    const clearable = mount(PtSelect, { props: { modelValue: 'vue', options, clearable: true } })
    await clearable.get('button[aria-label="Clear"]').trigger('click')
    expect(clearable.emitted('update:modelValue')?.[0]).toEqual([null])

    const disabled = mount(PtSelect, { props: { modelValue: 'vue', options, disabled: true } })
    expect(disabled.classes()).toContain('is-disabled')
    await disabled.get('[role="combobox"]').trigger('click')
    expect(disabled.get('[role="combobox"]').attributes('aria-expanded')).toBe('false')
  })

  it('renders slotted options', async () => {
    const wrapper = mount(PtSelect, {
      props: { modelValue: 'a' },
      slots: {
        default: '<pt-option label="Alpha" value="a" /><pt-option label="Beta" value="b" />'
      },
      global: { components: { PtOption } }
    })
    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()
    expect(wrapper.findAll('[role="option"]').map((node) => node.text())).toEqual(['Alpha', 'Beta'])
  })
})
