import { createAmountFormatter } from '@tc96/ui/helpers/format'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { PropertyMetaIcon } from '@tc96/ui/property-meta'
import { cn } from '@tc96/utils'
import {
  DataDate,
  DataOwner,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import {
  finance4DirectionAppearance,
  finance4KindAppearance,
  finance4KindDirection,
  finance4SituationAppearance,
  finance4Situations,
} from './finance-4-options'
import type {
  Finance4Case,
  Finance4Direction,
  Finance4Entry,
  Finance4Labels,
  Finance4Option,
  Finance4Person,
} from './types'

export interface Finance4FieldContext {
  caseById: ReadonlyMap<string, Finance4Case>
  clientById: ReadonlyMap<string, Finance4Option>
  formatAmount: (entry: Finance4Entry) => string
  labels: Finance4Labels
  lawyers: readonly Finance4Person[]
  locale: string
  onOpen?: (entryId: string) => void
  onSelectedChange?: (entryId: string, selected: boolean) => void
  selectedIds: ReadonlySet<string>
}

interface FieldProps {
  context: Finance4FieldContext
  item: Finance4Entry
}

const directionClass: Record<Finance4Direction, string | undefined> = {
  in: 'text-success-foreground',
  out: undefined,
}

export const finance4DayValue = (day: string) =>
  `${day.slice(0, 10)}T12:00:00.000Z`

export function createFinance4AmountFormatter(
  locale: string,
  currency: string,
): (entry: Finance4Entry) => string {
  const formatter = createAmountFormatter({
    currency,
    locale,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'exceptZero',
    style: 'currency',
  })
  return (entry) => {
    const cents = Math.abs(entry.amount)
    const signed = finance4KindDirection[entry.kind] === 'in' ? cents : -cents
    return formatter.format(signed / 100)
  }
}

export const finance4KindLabel = (
  labels: Finance4Labels,
  item: Finance4Entry,
) =>
  item.kind === 'fee' && item.feeType
    ? labels.feeTypes[item.feeType]
    : labels.kinds[item.kind]

export function Finance4DirectionMark({ context, item }: FieldProps) {
  const direction = finance4KindDirection[item.kind]
  return (
    <span
      className="flex size-4 items-center"
      data-direction={direction}
      data-slot="finance-4-direction"
    >
      <PropertyMetaIcon
        className="size-4"
        meta={finance4DirectionAppearance[direction]}
      />
      <span className="sr-only">
        {context.labels.amountDirections[direction]}
      </span>
    </span>
  )
}

export function Finance4KindField({ context, item }: FieldProps) {
  return (
    <IconLabelProperty
      className="text-muted-foreground"
      label={finance4KindLabel(context.labels, item)}
      leading={
        <PropertyMetaIcon
          className="size-4"
          meta={finance4KindAppearance[item.kind]}
        />
      }
      variant="plain"
    />
  )
}

export function Finance4AmountField({ context, item }: FieldProps) {
  const direction = finance4KindDirection[item.kind]
  return (
    <span
      className={cn(
        'ms-auto font-medium tabular-nums',
        directionClass[direction],
      )}
      data-direction={direction}
      data-slot="finance-4-amount"
    >
      {context.formatAmount(item)}
    </span>
  )
}

export function Finance4ClientField({ context, item }: FieldProps) {
  const { clientById, labels } = context
  return (
    <TextProperty
      ariaLabel={labels.columns.client}
      labels={{ fallback: labels.noClient }}
      value={
        item.clientId ? (clientById.get(item.clientId)?.label ?? null) : null
      }
      variant="plain"
    />
  )
}

export function Finance4CaseField({ context, item }: FieldProps) {
  const { caseById, labels } = context
  return (
    <TextProperty
      ariaLabel={labels.columns.case}
      labels={{ fallback: labels.noCase }}
      value={item.caseId ? (caseById.get(item.caseId)?.label ?? null) : null}
      variant="plain"
    />
  )
}

export function Finance4ResponsibleField({ context, item }: FieldProps) {
  const { labels, lawyers } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.responsible}
      owners={lawyers}
      placeholder={labels.unassigned}
      value={item.responsibleId}
      variant="plain"
    />
  )
}

export function Finance4DueField({ context, item }: FieldProps) {
  const { labels, locale } = context
  return (
    <DataDate
      ariaLabel={labels.columns.due}
      fallback={labels.noValue}
      locale={locale}
      overdue={item.situation === 'overdue'}
      timeZone="UTC"
      value={finance4DayValue(item.dueOn)}
      variant="plain"
    />
  )
}

export function Finance4SituationField({ context, item }: FieldProps) {
  const { labels } = context
  return (
    <DataSelect
      ariaLabel={labels.columns.situation}
      options={dataSelectOptions(
        finance4Situations,
        labels.situations,
        finance4SituationAppearance,
      )}
      value={item.situation}
      variant="plain"
    />
  )
}

export const finance4CaseCaption = (
  context: Finance4FieldContext,
  item: Finance4Entry,
): string[] => {
  const found = item.caseId ? context.caseById.get(item.caseId) : undefined
  if (!found) return []
  return found.number ? [found.label, found.number] : [found.label]
}
