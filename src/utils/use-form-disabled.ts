import { computed, inject, type ComputedRef } from 'vue'
import { formContextKey } from '../components/form/tokens'

export function useFormDisabled(disabled: () => boolean | undefined): ComputedRef<boolean> {
  const form = inject(formContextKey, undefined)
  return computed(() => Boolean(disabled() || form?.disabled))
}
