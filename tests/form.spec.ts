import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import PorticoUI from '../src'

function factory(initial = '') {
  return mount(
    defineComponent({
      template: `
        <pt-form ref="formRef" :model="model" :rules="rules">
          <pt-form-item label="Username" prop="name">
            <pt-input v-model="model.name" />
          </pt-form-item>
        </pt-form>
      `,
      setup() {
        const formRef = ref()
        const model = reactive({ name: initial })
        const rules = {
          name: [{ required: true, message: 'Username is required', trigger: 'blur' }]
        }
        return { formRef, model, rules }
      }
    }),
    { global: { plugins: [PorticoUI] } }
  )
}

describe('PtForm validation', () => {
  it('rejects empty required fields and shows the error message', async () => {
    const wrapper = factory('')
    const form = (wrapper.vm as unknown as { formRef: { validate: () => Promise<boolean> } }).formRef
    await expect(form.validate()).rejects.toThrow(/validation failed/)
    expect(wrapper.get('.pt-form-item__error').text()).toBe('Username is required')
    expect(wrapper.get('.pt-form-item').classes()).toContain('is-error')
  })

  it('passes validation when the required value is present', async () => {
    const wrapper = factory('Ada')
    const form = (wrapper.vm as unknown as { formRef: { validate: () => Promise<boolean> } }).formRef
    await expect(form.validate()).resolves.toBe(true)
    expect(wrapper.find('.pt-form-item__error').exists()).toBe(false)
  })

  it('associates the label with the input', () => {
    const wrapper = factory()
    const label = wrapper.get('label')
    const input = wrapper.get('input')
    expect(label.attributes('for')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('clears errors after resetFields', async () => {
    const wrapper = factory('')
    const form = (
      wrapper.vm as unknown as {
        formRef: { validate: () => Promise<boolean>; resetFields: () => void }
        model: { name: string }
      }
    ).formRef
    await expect(form.validate()).rejects.toThrow()
    form.resetFields()
    await nextTick()
    expect(wrapper.find('.pt-form-item__error').exists()).toBe(false)
  })

  it('marks the input invalid after a failed validate and clears aria on success', async () => {
    const wrapper = factory('')
    const form = (wrapper.vm as unknown as { formRef: { validate: () => Promise<boolean> } }).formRef
    await expect(form.validate()).rejects.toThrow()
    const input = wrapper.get('input')
    const error = wrapper.get('.pt-form-item__error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
  })

  it('disables nested controls when the form is disabled', () => {
    const wrapper = mount(
      defineComponent({
        template: `
          <pt-form disabled>
            <pt-form-item label="Name" prop="name">
              <pt-input model-value="" />
            </pt-form-item>
          </pt-form>
        `
      }),
      { global: { plugins: [PorticoUI] } }
    )
    expect((wrapper.get('input').element as HTMLInputElement).disabled).toBe(true)
  })
})
