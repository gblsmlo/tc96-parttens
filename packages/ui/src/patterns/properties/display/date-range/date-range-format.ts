import type { DateRange } from '@daypicker/react'
import { formatShortDate, isValidDate } from '@tc96/ui/helpers/date'
import {
  type DateRangePropertyLabels,
  defaultPropertyLabels,
} from '../../shared/property-labels'

export function formatDateRangeProperty(
  value: DateRange | undefined,
  fallback: string,
  locale: string,
  {
    from: fromLabel = defaultPropertyLabels.dateRange.from,
    until: untilLabel = defaultPropertyLabels.dateRange.until,
  }: Readonly<Partial<Pick<DateRangePropertyLabels, 'from' | 'until'>>> = {},
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
