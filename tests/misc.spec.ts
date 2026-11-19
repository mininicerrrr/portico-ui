import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PtTag } from '../src/components/tag'
import { PtCard } from '../src/components/card'
import { PtSpace } from '../src/components/space'
import { PtDivider } from '../src/components/divider'
import { PtButton } from '../src/components/button'

describe('PtTag', () => {
  it('applies type and effect classes and emits close', async () => {
    const wrapper = mount(PtTag, {
      props: { type: 'danger', effect: 'plain', closable: true, round: true },
      slots: { default: 'Expired' }
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['pt-tag--danger', 'pt-tag--plain', 'is-round'])
    )
    expect(wrapper.text()).toContain('Expired')
    await wrapper.get('button[aria-label="Remove"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})

describe('PtCard', () => {
  it('renders header, body, footer and shadow modifiers', () => {
    const wrapper = mount(PtCard, {
      props: { header: 'Overview', shadow: 'hover' },
      slots: { default: 'Body', footer: 'Footer' }
    })
    expect(wrapper.classes()).toContain('pt-card--shadow-hover')
    expect(wrapper.get('.pt-card__header').text()).toBe('Overview')
    expect(wrapper.get('.pt-card__body').text()).toBe('Body')
    expect(wrapper.get('.pt-card__footer').text()).toBe('Footer')
  })
})

describe('PtSpace', () => {
  it('wraps adjacent children with a configured gap', () => {
    const wrapper = mount(PtSpace, {
      props: { size: 20, wrap: true, direction: 'horizontal' },
      slots: {
        default: [PtButton, PtButton]
      },
      global: { components: { PtButton } }
    })
    // slot as component constructors may not flatten usefully; use a template instead if needed
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['pt-space--horizontal', 'is-wrap']))
    expect((wrapper.element as HTMLElement).style.gap).toBe('20px')
  })

  it('renders slotted buttons as separate items', () => {
    const wrapper = mount({
      components: { PtSpace, PtButton },
      template: `
        <pt-space size="small" direction="vertical" spacer>
          <pt-button>One</pt-button>
          <pt-button>Two</pt-button>
        </pt-space>
      `
    })
    expect(wrapper.findAll('.pt-space__item')).toHaveLength(2)
    expect(wrapper.findAll('.pt-space__spacer')).toHaveLength(1)
    expect((wrapper.element as HTMLElement).style.gap).toBe('8px')
  })
})

describe('PtDivider', () => {
  it('renders a labelled horizontal separator and a vertical one', () => {
    const horizontal = mount(PtDivider, { props: { contentPosition: 'left' }, slots: { default: 'Or' } })
    expect(horizontal.attributes('role')).toBe('separator')
    expect(horizontal.attributes('aria-orientation')).toBe('horizontal')
    expect(horizontal.get('.pt-divider__text').text()).toBe('Or')
    expect(horizontal.classes()).toContain('pt-divider--left')

    const vertical = mount(PtDivider, { props: { direction: 'vertical' }, slots: { default: 'hidden' } })
    expect(vertical.attributes('aria-orientation')).toBe('vertical')
    expect(vertical.find('.pt-divider__text').exists()).toBe(false)
  })
})
