import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PtTableEllipsisCell } from '../src/components/table'

describe('PtTableEllipsisCell', () => {
  it('renders ellipsis cell with tooltip by default', () => {
    const wrapper = mount(PtTableEllipsisCell, { props: { content: 'Long title' } })
    expect(wrapper.find('.pt-table__cell').text()).toBe('Long title')
    expect(wrapper.findComponent({ name: 'PtTooltip' }).exists()).toBe(true)
  })

  it('can disable tooltip while keeping ellipsis class', () => {
    const wrapper = mount(PtTableEllipsisCell, {
      props: { content: 'Text', showOverflowTooltip: false }
    })
    expect(wrapper.find('.pt-table__cell').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'PtTooltip' }).exists()).toBe(false)
  })
})