import { DataDate } from '../../shared/properties/data-properties'
import type { Legal7Labels, Legal7Publication } from './types'

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

export function legal7DateOf(value: string, timeZone: string | undefined) {
  return calendarDay.test(value)
    ? { timeZone: 'UTC', value: `${value}T12:00:00.000Z` }
    : { timeZone, value }
}

export interface Legal7FieldContext {
  formatDate: (value: string) => string
  labels: Legal7Labels
  locale?: string
  onOpen?: (publicationId: string) => void
  timeZone?: string
}

export function Legal7AvailableField({
  context,
  item,
}: Readonly<{ context: Legal7FieldContext; item: Legal7Publication }>) {
  const { labels, locale, timeZone } = context
  return (
    <span className="flex items-baseline gap-2">
      <DataDate
        ariaLabel={labels.columns.availableOn}
        fallback=""
        locale={locale}
        variant="plain"
        {...legal7DateOf(item.availableOn, timeZone)}
      />
      <span className="shrink-0 text-muted-foreground text-xs">
        {item.wait}
      </span>
    </span>
  )
}
