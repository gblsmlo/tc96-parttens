import type { DateRange } from '@daypicker/react'
import { formatShortDate, isValidDate } from '@tc96/helpers/date'

export function formatDateRangeProperty(
  value: DateRange | undefined,
  fallback: string,
  locale: string,
  {
    fromLabel = 'A partir de',
    untilLabel = 'Até',
  }: Readonly<{ fromLabel?: string; untilLabel?: string }> = {},
): string {
  const from = formatEnd(value?.from, locale)
  const to = formatEnd(value?.to, locale)

  if (from && to) return `${from} – ${to}`
  if (from) return `${fromLabel} ${from}`
  if (to) return `${untilLabel} ${to}`
  return fallback
}

function formatEnd(date: Date | undefined, locale: string): string | null {
  return isValidDate(date) ? formatShortDate(date, locale) : null
}
