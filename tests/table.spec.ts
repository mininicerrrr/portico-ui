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
