import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { PtCheckbox, PtCheckboxGroup } from '../src/components/checkbox'

describe('PtCheckbox', () => {
  it('toggles a boolean v-model', async () => {
    const wrapper = mount(PtCheckbox, { props: { modelValue: false }, slots: { default: 'Agree' } })
    const input = wrapper.get('input[type="checkbox"]')
    expect((input.element as HTMLInputElement).checked).toBe(false)
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('supports checkbox groups with array models', async () => {
    const wrapper = mount(
      defineComponent({
        components: { PtCheckbox, PtCheckboxGroup },
        template: `
          <pt-checkbox-group v-model="langs">
            <pt-checkbox value="vue">Vue</pt-checkbox>
            <pt-checkbox value="ts">TypeScript</pt-checkbox>
          </pt-checkbox-group>
        `,
        setup() {
          const langs = ref(['vue'])
          return { langs }
        }
      })
    )
    const inputs = wrapper.findAll('input[type="checkbox"]')
    expect((inputs[0].element as HTMLInputElement).checked).toBe(true)
    await inputs[1].setValue(true)
    expect((wrapper.vm as { langs: string[] }).langs).toEqual(['vue', 'ts'])
  })

  it('exposes the mixed state for an indeterminate checkbox', () => {
    const wrapper = mount(PtCheckbox, { props: { modelValue: false, indeterminate: true } })
    expect(wrapper.classes()).toContain('is-indeterminate')
    expect(wrapper.get('input').attributes('aria-checked')).toBe('mixed')
    expect((wrapper.get('input').element as HTMLInputElement).indeterminate).toBe(true)
  })

  it('disables a single checkbox', () => {
    const wrapper = mount(PtCheckbox, { props: { disabled: true, modelValue: false } })
    expect(wrapper.classes()).toContain('is-disabled')
    expect((wrapper.get('input').element as HTMLInputElement).disabled).toBe(true)
  })
})
