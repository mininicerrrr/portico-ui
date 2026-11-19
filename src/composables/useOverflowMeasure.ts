import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/** True when `el` text is visually truncated (ellipsis). Re-measures on resize and when `deps` change. */
export function useOverflowMeasure(elRef: Ref<HTMLElement | undefined>, deps: () => unknown[]) {
  const overflows = ref(false)
  let observer: ResizeObserver | undefined

  function measure() {
    const el = elRef.value
    if (!el) {
      overflows.value = false
      return
    }
    overflows.value = el.scrollWidth > el.clientWidth + 1
  }

  watch(deps, () => nextTick(measure))

  onMounted(() => {
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => measure())
    }
    watch(
      elRef,
      (el, prev) => {
        if (prev && observer) observer.unobserve(prev)
        nextTick(measure)
        if (el && observer) observer.observe(el)
      },
      { immediate: true }
    )
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return { overflows, remeasure: measure }
}