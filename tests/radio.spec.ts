import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { PtRadio, PtRadioGroup } from '../src/components/radio'

describe('PtRadio', () => {
  it('selects a value inside a group', async () => {
    const wrapper = mount(
      defineComponent({
        components: { PtRadio, PtRadioGroup },
        template: `
          <pt-radio-group v-model="size">
            <pt-radio value="large">Large</pt-radio>
            <pt-radio value="small">Small</pt-radio>
          </pt-radio-group>
        `,
        setup() {
          const size = ref('large')
          return { size }
        }
      })
    )
    const radios = wrapper.findAll('input[type="radio"]')
    expect((radios[0].element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.get('.pt-radio-group').attributes('role')).toBe('radiogroup')
    await radios[1].setValue(true)
    expect((wrapper.vm as { size: string }).size).toBe('small')
  })

  it('disables an individual radio and the whole group', () => {
    const single = mount(PtRadio, { props: { value: 'a', modelValue: 'b', disabled: true }, slots: { default: 'A' } })
    expect((single.get('input').element as HTMLInputElement).disabled).toBe(true)

    const group = mount(
      defineComponent({
        components: { PtRadio, PtRadioGroup },
        template: `
          <pt-radio-group model-value="a" disabled>
            <pt-radio value="a">A</pt-radio>
          </pt-radio-group>
        `
      })
    )
    expect((group.get('input').element as HTMLInputElement).disabled).toBe(true)
  })
})
