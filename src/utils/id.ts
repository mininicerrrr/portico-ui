let seed = 0

export function ptId(prefix = 'pt'): string {
  seed += 1
  return `${prefix}-${seed}`
}

export function resetPtId(value = 0): void {
  seed = value
}
