export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function getPath(source: Record<string, unknown> | undefined, path: string): unknown {
  if (!source || !path) return undefined
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, source)
}

export function setPath(source: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.')
  const last = keys.pop()
  if (!last) return
  let cursor: Record<string, unknown> = source
  for (const key of keys) {
    const next = cursor[key]
    if (!isObject(next)) {
      cursor[key] = {}
    }
    cursor = cursor[key] as Record<string, unknown>
  }
  cursor[last] = value
}

export function lockBodyScroll(): () => void {
  const { body } = document
  const previous = body.style.overflow
  body.style.overflow = 'hidden'
  return () => {
    body.style.overflow = previous
  }
}
