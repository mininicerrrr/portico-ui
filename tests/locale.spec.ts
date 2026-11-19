import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PorticoUI, { PtConfigProvider, PtSelect, en } from '../src'

const options = [{ label: 'A', value: 'a' }]

describe('locale', () => {
  it('uses zh-CN strings by default', async () => {
    const wrapper = mount(PtSelect, { props: { modelValue: null, options: [] } })
    expect(wrapper.get('.pt-select__placeholder').text()).toBe('请选择')
    await wrapper.get('[role="combobox"]').trigger('click')
    await nextTick()
    expect(wrapper.get('.pt-select__empty').text()).toBe('暂无数据')
  })

  it('switches copy through PtConfigProvider and the English pack', async () => {
    const wrapper = mount(
      {
        components: { PtConfigProvider, PtSelect },
        template: `
          <pt-config-provider :locale="en">
            <pt-select :model-value="null" :options="options" />
          </pt-config-provider>
        `,
        setup: () => ({ en, options })
      },
      { global: { plugins: [PorticoUI] } }
    )
    expect(wrapper.get('.pt-select__placeholder').text()).toBe('Please select')
  })
})
