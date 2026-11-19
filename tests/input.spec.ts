import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { PtInput } from '../src/components/input'

describe('PtInput', () => {
  it('supports v-model updates', async () => {
    const wrapper = mount(PtInput, { props: { modelValue: 'hello' } })
    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).value).toBe('hello')
    await input.setValue('world')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world'])
  })

  it('clears the value when clearable and the clear button is used', async () => {
    const wrapper = mount(PtInput, { props: { modelValue: 'draft', clearable: true } })
    await wrapper.trigger('mouseenter')
    await nextTick()
    const clear = wrapper.get('button[aria-label="Clear"]')
    await clear.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('toggles password visibility', async () => {
    const wrapper = mount(PtInput, { props: { modelValue: 'secret', type: 'password', showPassword: true } })
    expect(wrapper.get('input').attributes('type')).toBe('password')
    await wrapper.get('button[aria-label="Show password"]').trigger('click')
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('honors the disabled state', () => {
    const wrapper = mount(PtInput, { props: { disabled: true, modelValue: 'x' } })
    expect(wrapper.classes()).toContain('is-disabled')
    expect((wrapper.get('input').element as HTMLInputElement).disabled).toBe(true)
  })

  it('applies size classes', () => {
    const wrapper = mount(PtInput, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('pt-input--large')
  })
})
