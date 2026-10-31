import { isValidDate, parseDateValue } from '@tc96/helpers/date'

let dateFormatter: Intl.DateTimeFormat | undefined

export function toStringValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

export function formatDate(value: unknown): string {
  if (!value) return ''
  const date = parseDateValue(value)
  if (!isValidDate(date)) return toStringValue(value)
  dateFormatter ??= new Intl.DateTimeFormat()
  return dateFormatter.format(date)
}
