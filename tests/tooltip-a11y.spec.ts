import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PtTooltip from '../src/components/tooltip/Tooltip.vue'

describe('PtTooltip a11y', () => {
  it('assigns unique panel ids and aria-describedby while open', async () => {
    const one = mount(PtTooltip, {
      props: { content: 'One', triggers: ['focus'], showAfter: 0 },
      attachTo: document.body
    })
    const two = mount(PtTooltip, {
      props: { content: 'Two', triggers: ['focus'], showAfter: 0 },
      attachTo: document.body
    })
    const panelIds = [...document.body.querySelectorAll('[id^="pt-tooltip-panel-"]')].map((el) => el.id)
    expect(panelIds.length).toBe(2)
    expect(new Set(panelIds).size).toBe(2)

    await one.find('.pt-tooltip').trigger('focusin')
    await new Promise((r) => setTimeout(r, 30))
    const described = one.find('.pt-tooltip').attributes('aria-describedby')
    expect(described).toBeTruthy()
    expect(panelIds).toContain(described)
    expect(document.getElementById(described!)?.getAttribute('role')).toBe('tooltip')
    one.unmount()
    two.unmount()
  })

  it('closes on Escape', async () => {
    const wrapper = mount(PtTooltip, {
      props: { content: 'Help', triggers: ['focus'], showAfter: 0, hideAfter: 0 },
      attachTo: document.body
    })
    await wrapper.find('.pt-tooltip').trigger('focusin')
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBeTruthy()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.find('.pt-tooltip').attributes('aria-describedby')).toBeUndefined()
    wrapper.unmount()
  })
})