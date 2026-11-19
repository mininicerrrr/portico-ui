import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PtButton } from '../src/components/button'

describe('PtButton', () => {
  it('renders a native button with the default slot', () => {
    const wrapper = mount(PtButton, { slots: { default: 'Save' } })
    const button = wrapper.get('button')
    expect(button.text()).toBe('Save')
    expect(button.attributes('type')).toBe('button')
    expect(button.classes()).toContain('pt-button--default')
  })

  it('applies type, size, plain and text modifiers', () => {
    const wrapper = mount(PtButton, {
      props: { type: 'primary', size: 'large', plain: true }
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['pt-button--primary', 'pt-button--large', 'pt-button--plain']))

    const text = mount(PtButton, { props: { text: true, type: 'danger' } })
    expect(text.classes()).toContain('pt-button--text')
    expect(text.classes()).not.toContain('pt-button--plain')
  })

  it('shows a 16px spinner when loading without removing slot content from DOM', async () => {
    const loading = mount(PtButton, { props: { type: 'primary', loading: true }, slots: { default: '保存中' } })
    const spinner = loading.get('.pt-button__spinner')
    expect(spinner.exists()).toBe(true)
    expect(loading.get('.pt-button__content').text()).toBe('保存中')
  })

  it('disables the button and blocks click when disabled or loading', async () => {
    const disabled = mount(PtButton, { props: { disabled: true }, slots: { default: 'Go' } })
    expect(disabled.get('button').element.disabled).toBe(true)
    expect(disabled.classes()).toContain('is-disabled')

    const loading = mount(PtButton, { props: { loading: true }, slots: { default: 'Wait' } })
    expect(loading.get('button').element.disabled).toBe(true)
    expect(loading.classes()).not.toContain('is-disabled')
    expect(loading.get('button').attributes('aria-busy')).toBe('true')
    expect(loading.find('.pt-button__spinner').exists()).toBe(true)
  })

  it('is keyboard activatable as a native button', async () => {
    const clicks: string[] = []
    const wrapper = mount(PtButton, {
      slots: { default: 'OK' },
      attrs: { onClick: () => clicks.push('click') }
    })
    await wrapper.get('button').trigger('click')
    expect(clicks).toEqual(['click'])
  })
})
