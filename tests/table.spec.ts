import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { PtTable, type TableColumn } from '../src/components/table'

const columns: TableColumn[] = [
  { prop: 'name', label: 'Name' },
  { prop: 'role', label: 'Role', formatter: (_row, _col, value) => String(value).toUpperCase() }
]

describe('PtTable', () => {
  it('renders column headers and row data', () => {
    const wrapper = mount(PtTable, {
      props: {
        columns,
        data: [
          { id: 1, name: 'Ada', role: 'admin' },
          { id: 2, name: 'Lin', role: 'editor' }
        ]
      }
    })
    const headers = wrapper.findAll('th').map((node) => node.text())
    expect(headers).toEqual(['Name', 'Role'])
    const text = wrapper.text()
    expect(text).toContain('Ada')
    expect(text).toContain('Lin')
    expect(text).toContain('ADMIN')
    expect(text).toContain('EDITOR')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('shows the empty state when there is no data', () => {
    const wrapper = mount(PtTable, {
      props: { columns, data: [], emptyText: 'Nothing here' }
    })
    expect(wrapper.get('.pt-table__empty').text()).toBe('Nothing here')
    expect(wrapper.get('td').attributes('colspan')).toBe('2')
  })

  it('renders a custom empty slot', () => {
    const wrapper = mount(PtTable, {
      props: { columns, data: [] },
      slots: { empty: 'Custom empty' }
    })
    expect(wrapper.get('.pt-table__empty').text()).toBe('Custom empty')
  })

  it('renders a named column slot', () => {
    const wrapper = mount(PtTable, {
      props: {
        columns: [
          { prop: 'name', label: 'Name', slot: 'name' },
          { prop: 'role', label: 'Role' }
        ],
        data: [{ id: 1, name: 'Ada', role: 'admin' }]
      },
      slots: {
        name: ({ value }: { value: unknown }) => h('strong', `Hi ${value}`)
      }
    })
    expect(wrapper.get('td').text()).toBe('Hi Ada')
    expect(wrapper.get('th').attributes('scope')).toBe('col')
  })
})

describe('PtTable extras', () => {
  it('sorts rows and emits sort-change', async () => {
    const wrapper = mount(PtTable, {
      props: {
        columns: [
          { prop: 'name', label: 'Name', sortable: true },
          { prop: 'count', label: 'Count', sortable: true }
        ],
        data: [
          { id: 1, name: 'Lin', count: 3 },
          { id: 2, name: 'Ada', count: 9 },
          { id: 3, name: 'Bo', count: 1 }
        ]
      }
    })
    await wrapper.findAll('th')[0].trigger('click')
    expect(wrapper.emitted('sort-change')?.[0]).toEqual([{ prop: 'name', order: 'asc' }])
    expect(wrapper.findAll('tbody tr').map((row) => row.find('td').text())).toEqual(['Ada', 'Bo', 'Lin'])
    await wrapper.findAll('th')[0].trigger('click')
    expect(wrapper.emitted('sort-change')?.[1]).toEqual([{ prop: 'name', order: 'desc' }])
    expect(wrapper.findAll('tbody tr').map((row) => row.find('td').text())).toEqual(['Lin', 'Bo', 'Ada'])
  })

  it('shows skeleton rows and a loading status while keeping headers', () => {
    const wrapper = mount(PtTable, {
      props: {
        columns,
        data: [{ id: 1, name: 'Ada', role: 'admin' }],
        loading: true
      }
    })
    expect(wrapper.find('.pt-table__loading-status').exists()).toBe(true)
    expect(wrapper.find('.pt-table__skeleton-row').exists()).toBe(true)
    expect(wrapper.findAll('th').map((node) => node.text())).toEqual(['Name', 'Role'])
    expect(wrapper.text()).not.toContain('Ada')
    expect(wrapper.text()).toContain('加载中')
  })

  it('virtualizes only when the virtual prop is set', () => {
    const data = Array.from({ length: 200 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}`, role: 'n' }))
    const virtual = mount(PtTable, {
      props: { columns, data, virtual: true, maxHeight: 200, rowHeight: 40 }
    })
    expect(virtual.findAll('tbody tr').length).toBeLessThan(200)
    expect(virtual.text()).not.toMatch(/rendered/i)
    const plain = mount(PtTable, {
      props: { columns, data, maxHeight: 200 }
    })
    expect(plain.findAll('tbody tr').length).toBe(200)
  })
})
