import { Button } from '@tc96/ui/button'
import { cn } from '@tc96/utils'
import { DataCollectionTitleCell } from '../../shared/collection/data-collection-record-parts'
import { DataDate, DataOwner } from '../../shared/properties/data-properties'
import { legal6ToneClasses } from './legal-6-options'
import type {
  Legal6DateFormat,
  Legal6Deadline,
  Legal6Labels,
  Legal6Person,
} from './types'

export interface Legal6FieldContext {
  dateFormat: Legal6DateFormat
  labels: Legal6Labels
  locale?: string
  onConfirm?: (deadlineId: string) => void
  onReject?: (deadlineId: string) => void
  owners: readonly Legal6Person[]
  timeZone?: string
}

interface FieldProps {
  context: Legal6FieldContext
  item: Legal6Deadline
}

const calendarDay = /^\d{4}-\d{2}-\d{2}$/

const dateValueOf = (value: string) =>
  calendarDay.test(value) ? `${value}T12:00:00.000Z` : value

const numericDateOf = (
  value: string,
  locale: string | undefined,
  timeZone: string | undefined,
) => {
  const date = new Date(dateValueOf(value))
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    timeZone: calendarDay.test(value) ? 'UTC' : timeZone,
    year: 'numeric',
  }).format(date)
}

export function Legal6DeadlineField({
  item,
}: Readonly<Pick<FieldProps, 'item'>>) {
  if (item.kind && item.kind !== item.label)
    return <DataCollectionTitleCell caption={[item.kind]} title={item.label} />
  return (
    <span className="block min-w-56 max-w-80 truncate font-medium">
      {item.label}
    </span>
  )
}

export function Legal6DateField({
  context,
  field,
  item,
}: Readonly<FieldProps & { field: 'fatalDate' | 'internalDate' }>) {
  const { dateFormat, labels, locale, timeZone } = context
  return (
    <DataDate
      ariaLabel={labels.columns[field]}
      displayLabel={
        dateFormat === 'numeric'
          ? numericDateOf(item[field], locale, timeZone)
          : undefined
      }
      fallback={labels.noDate}
      locale={locale}
      timeZone={timeZone}
      value={dateValueOf(item[field])}
    />
  )
}

export function Legal6DaysLeftField({
  item,
}: Readonly<Pick<FieldProps, 'item'>>) {
  return (
    <span
      className={cn('whitespace-nowrap', legal6ToneClasses[item.daysLeft.tone])}
      data-tone={item.daysLeft.tone}
    >
      {item.daysLeft.label}
    </span>
  )
}

export function Legal6OwnerField({ context, item }: Readonly<FieldProps>) {
  const { labels, owners } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.owner}
      owners={owners}
      placeholder={labels.unassigned}
      value={item.ownerId}
    />
  )
}

export function Legal6DecisionField({ context, item }: Readonly<FieldProps>) {
  const { labels, onConfirm, onReject } = context
  return (
    <fieldset
      aria-label={labels.decisionOf(item.label)}
      className="m-0 flex min-w-0 gap-2 border-0 p-0"
    >
      {onConfirm ? (
        <Button
          onClick={() => onConfirm(item.id)}
          size="sm"
          type="button"
          variant="outline"
        >
          {labels.confirm}
        </Button>
      ) : null}
      {onReject ? (
        <Button
          onClick={() => onReject(item.id)}
          size="sm"
          type="button"
          variant="ghost"
        >
          {labels.reject}
        </Button>
      ) : null}
    </fieldset>
  )
}
