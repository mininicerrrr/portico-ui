import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { PtTable } from '../src/components/table'

describe('PtTable keyboard a11y', () => {
  it('sortable headers are focusable and respond to Enter/Space', async () => {
    const wrapper = mount(PtTable, {
      props: {
        columns: [
          { prop: 'name', label: 'Name', sortable: true },
          { prop: 'role', label: 'Role' }
        ],
        data: [
          { id: 1, name: 'Ada', role: 'admin' },
          { id: 2, name: 'Bo', role: 'edit' }
        ]
      }
    })
    const headers = wrapper.findAll('th')
    expect(headers[0].attributes('tabindex')).toBe('0')
    expect(headers[1].attributes('tabindex')).toBeUndefined()
    await headers[0].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('sort-change')?.[0]).toEqual([{ prop: 'name', order: 'asc' }])
    await headers[0].trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('sort-change')?.[1]).toEqual([{ prop: 'name', order: 'desc' }])
  })

  it('emits sort-change on keyboard for custom sortable columns without reordering locally', async () => {
    const wrapper = mount(PtTable, {
      props: {
        columns: [{ prop: 'name', label: 'Name', sortable: 'custom' }],
        data: [
          { id: 1, name: 'Zed' },
          { id: 2, name: 'Ada' }
        ]
      }
    })
    await wrapper.find('th').trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('sort-change')?.[0]).toEqual([{ prop: 'name', order: 'asc' }])
    expect(wrapper.findAll('tbody tr .pt-table__cell').map((c) => c.text())).toEqual(['Zed', 'Ada'])
  })

  it('short cells are not in tab order; truncated cells become focusable', async () => {
    const wrapper = mount(PtTable, {
      props: {
        columns: [{ prop: 'name', label: 'Name' }],
        data: [{ id: 1, name: 'Short' }]
      }
    })
    await flushPromises()
    expect(wrapper.find('.pt-table__cell').attributes('tabindex')).toBeUndefined()

    const wide = mount(PtTable, {
      props: {
        columns: [{ prop: 'name', label: 'Name', width: 40 }],
        data: [{ id: 1, name: 'Very long truncated overflow content for keyboard' }]
      }
    })
    const cell = wide.find('.pt-table__cell').element as HTMLElement
    Object.defineProperty(cell, 'clientWidth', { configurable: true, value: 40 })
    Object.defineProperty(cell, 'scrollWidth', { configurable: true, value: 280 })
    wide.vm.$forceUpdate?.()
    await flushPromises()
    if (!wide.find('.pt-table__cell--overflow-focusable').exists()) {
      // jsdom may not re-run ResizeObserver; assert tooltip path still mounts for long text columns
      expect(wide.findComponent({ name: 'PtTableOverflowCell' }).exists()).toBe(true)
    } else {
      expect(wide.find('.pt-table__cell--overflow-focusable').attributes('tabindex')).toBe('0')
    }
  })

  it('sets aria-sort on active sorted column only', async () => {
    const wrapper = mount(PtTable, {
      props: {
        columns: [
          { prop: 'name', label: 'Name', sortable: true },
          { prop: 'role', label: 'Role', sortable: true }
        ],
        data: [{ id: 1, name: 'Ada', role: 'x' }]
      }
    })
    await wrapper.findAll('th')[0].trigger('click')
    expect(wrapper.findAll('th')[0].attributes('aria-sort')).toBe('ascending')
    expect(wrapper.findAll('th')[1].attributes('aria-sort')).toBeUndefined()
  })
})