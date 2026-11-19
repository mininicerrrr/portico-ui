import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PtSwitch } from '../src/components/switch'

describe('PtSwitch', () => {
  it('toggles with click and keeps a stable id across renders', async () => {
    const wrapper = mount(PtSwitch, { props: { modelValue: false } })
    const button = wrapper.get('button[role="switch"]')
    const firstId = button.attributes('id')
    expect(button.attributes('aria-checked')).toBe('false')
    await button.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.get('button[role="switch"]').attributes('id')).toBe(firstId)
    expect(wrapper.get('button[role="switch"]').attributes('aria-checked')).toBe('true')
  })

  it('is activatable with Space and Enter', async () => {
    const wrapper = mount(PtSwitch, { props: { modelValue: false } })
    await wrapper.get('button').trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    const again = mount(PtSwitch, { props: { modelValue: true } })
    await again.get('button').trigger('keydown', { key: 'Enter' })
    expect(again.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('supports custom active and inactive values and honors disabled/loading', async () => {
    const custom = mount(PtSwitch, { props: { modelValue: 'off', activeValue: 'on', inactiveValue: 'off' } })
    await custom.get('button').trigger('click')
    expect(custom.emitted('update:modelValue')?.[0]).toEqual(['on'])

    const disabled = mount(PtSwitch, { props: { modelValue: false, disabled: true } })
    await disabled.get('button').trigger('click')
    expect(disabled.emitted('update:modelValue')).toBeFalsy()
    expect((disabled.get('button').element as HTMLButtonElement).disabled).toBe(true)

    const loading = mount(PtSwitch, { props: { modelValue: false, loading: true } })
    await loading.get('button').trigger('click')
    expect(loading.emitted('update:modelValue')).toBeFalsy()
  })
})
