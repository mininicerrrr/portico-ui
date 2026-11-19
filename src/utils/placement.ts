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
