export function startOfDay(date: Date): Date {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function parseDate(value: Date | string | null | undefined, valueFormat?: string): Date | null {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : startOfDay(value)
  if (!valueFormat || valueFormat === 'YYYY-MM-DD') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) {
      const parsed = new Date(value)
      return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed)
    }
    return startOfDay(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed)
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatDate(date: Date | null, format = 'YYYY-MM-DD'): string {
  if (!date) return ''
  return format
    .replace(/YYYY/g, String(date.getFullYear()))
    .replace(/MM/g, pad(date.getMonth() + 1))
    .replace(/DD/g, pad(date.getDate()))
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function buildMonthCells(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const startOffset = first.getDay()
  const cells: Date[] = []
  const start = new Date(year, month, 1 - startOffset)
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    cells.push(startOfDay(date))
  }
  return cells
}
