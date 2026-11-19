export type PtPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export function placementStyle(placement: PtPlacement, gap = 8): Record<string, string> {
  const style: Record<string, string> = { position: 'absolute' }
  const [main, cross] = placement.split('-') as [string, string | undefined]
  if (main === 'top' || main === 'bottom') {
    style[main === 'top' ? 'bottom' : 'top'] = `calc(100% + ${gap}px)`
    if (cross === 'start') style.left = '0'
    else if (cross === 'end') style.right = '0'
    else {
      style.left = '50%'
      style.transform = 'translateX(-50%)'
    }
  } else {
    style[main === 'left' ? 'right' : 'left'] = `calc(100% + ${gap}px)`
    if (cross === 'start') style.top = '0'
    else if (cross === 'end') style.bottom = '0'
    else {
      style.top = '50%'
      style.transform = 'translateY(-50%)'
    }
  }
  return style
}

/** Fixed viewport position for overflow hosts (e.g. table cells inside scroll wrappers). */
export function placementFixedStyle(
  rect: DOMRect,
  placement: PtPlacement,
  gap = 8
): Record<string, string> {
  const style: Record<string, string> = { position: 'fixed' }
  const [main, cross] = placement.split('-') as [string, string | undefined]
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  if (main === 'top' || main === 'bottom') {
    const y = main === 'top' ? rect.top - gap : rect.bottom + gap
    style.top = `${y}px`
    if (cross === 'start') {
      style.left = `${rect.left}px`
      style.transform = main === 'top' ? 'translateY(-100%)' : 'none'
    } else if (cross === 'end') {
      style.left = `${rect.right}px`
      style.transform = main === 'top' ? 'translate(-100%, -100%)' : 'translateX(-100%)'
    } else {
      style.left = `${cx}px`
      style.transform = main === 'top' ? 'translate(-50%, -100%)' : 'translateX(-50%)'
    }
  } else {
    const x = main === 'left' ? rect.left - gap : rect.right + gap
    style.left = `${x}px`
    if (cross === 'start') {
      style.top = `${rect.top}px`
      style.transform = main === 'left' ? 'translateX(-100%)' : 'none'
    } else if (cross === 'end') {
      style.top = `${rect.bottom}px`
      style.transform = main === 'left' ? 'translate(-100%, -100%)' : 'translateY(-100%)'
    } else {
      style.top = `${cy}px`
      style.transform = main === 'left' ? 'translate(-100%, -50%)' : 'translateY(-50%)'
    }
  }
  return style
}
