import {
  DataDate,
  DataOwner,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import {
  legal2QueueAppearance,
  legal2Queues,
  legal2StatusAppearance,
  legal2Statuses,
} from './legal-2-options'
import type {
  Legal2Contract,
  Legal2Labels,
  Legal2Person,
  Legal2Queue,
  Legal2Status,
} from './types'

export interface Legal2FieldContext {
  formatValue: (value: number) => string
  labels: Legal2Labels
  locale?: string
  onOpen?: (contractId: string) => void
  onOwnerChange?: (contractId: string, ownerId: string) => void
  onQueueChange?: (contractId: string, queue: Legal2Queue) => void
  onStatusChange?: (contractId: string, status: Legal2Status) => void
  owners: readonly Legal2Person[]
  queueOptions: ReturnType<typeof dataSelectOptions>
  statusOptions: ReturnType<typeof dataSelectOptions>
  timeZone?: string
}

export function createLegal2Options(labels: Legal2Labels) {
  return {
    queueOptions: dataSelectOptions(
      legal2Queues,
      labels.queues,
      legal2QueueAppearance,
    ),
    statusOptions: dataSelectOptions(
      legal2Statuses,
      labels.statuses,
      legal2StatusAppearance,
    ),
  }
}

interface FieldProps {
  context: Legal2FieldContext
  item: Legal2Contract
  variant?: DataPropertyVariant
}

export function Legal2StatusField({ context, item, variant }: FieldProps) {
  const { labels, onStatusChange, statusOptions } = context
  return (
    <DataSelect<Legal2Status>
      ariaLabel={labels.columns.status}
      onChange={
        onStatusChange ? (status) => onStatusChange(item.id, status) : undefined
      }
      options={statusOptions}
      value={item.status}
      variant={variant}
    />
  )
}

export function Legal2QueueField({ context, item, variant }: FieldProps) {
  const { labels, onQueueChange, queueOptions } = context
  return (
    <DataSelect<Legal2Queue>
      ariaLabel={labels.columns.queue}
      onChange={
        onQueueChange ? (queue) => onQueueChange(item.id, queue) : undefined
      }
      options={queueOptions}
      value={item.queue}
      variant={variant}
    />
  )
}

export function Legal2OwnerField({
  avatarOnly,
  context,
  item,
  variant,
}: FieldProps & { avatarOnly?: boolean }) {
  const { labels, onOwnerChange, owners } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.owner}
      avatarOnly={avatarOnly}
      onChange={
        onOwnerChange ? (ownerId) => onOwnerChange(item.id, ownerId) : undefined
      }
      owners={owners}
      placeholder={labels.unassigned}
      value={item.ownerId}
      variant={variant}
    />
  )
}

export function Legal2TermField({ context, item, variant }: FieldProps) {
  const { labels, locale, timeZone } = context
  return (
    <DataDate
      ariaLabel={labels.columns.term}
      fallback={labels.noEndDate}
      locale={locale}
      overdue={item.status === 'expired'}
      timeZone={timeZone}
      value={item.endsOn}
      variant={variant}
    />
  )
}

export function Legal2ValueText({
  context,
  item,
}: Readonly<Omit<FieldProps, 'variant'>>) {
  return (
    <span
      className={item.value === null ? 'text-muted-foreground' : 'tabular-nums'}
    >
      {item.value === null
        ? context.labels.noValue
        : context.formatValue(item.value)}
    </span>
  )
}
