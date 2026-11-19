import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { PtDatePicker } from '../src/components/date-picker'

describe('PtDatePicker', () => {
  it('selects a date value with valueFormat', async () => {
    const wrapper = mount(PtDatePicker, {
      props: { modelValue: null, type: 'date', valueFormat: 'YYYY-MM-DD' },
      attachTo: document.body
    })
    await wrapper.get('.pt-date-picker__control').trigger('click')
    await nextTick()
    const cells = wrapper.findAll('.pt-picker__cell:not(.is-other):not(.is-disabled)')
    await cells[0].trigger('click')
    const emitted = wrapper.emitted('update:modelValue')?.[0][0] as string
    expect(emitted).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    wrapper.unmount()
  })

  it('selects a date range', async () => {
    const wrapper = mount(
      {
        components: { PtDatePicker },
        template: '<pt-date-picker v-model="value" type="daterange" value-format="YYYY-MM-DD" />',
        data: () => ({ value: [null, null] as [string | null, string | null] })
      },
      { attachTo: document.body }
    )
    await wrapper.get('.pt-date-picker__control').trigger('click')
    await nextTick()
    const cells = wrapper.findAll('.pt-picker__cell:not(.is-other):not(.is-disabled)')
    await cells[0].trigger('click')
    await cells[2].trigger('click')
    const value = (wrapper.vm as unknown as { value: [string, string] }).value
    expect(value[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(value[1]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(value[1] >= value[0]).toBe(true)
    wrapper.unmount()
  })
})
