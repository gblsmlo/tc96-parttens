import {
  DataDate,
  DataOwner,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import {
  legal3QueueAppearance,
  legal3Queues,
  legal3StatusAppearance,
  legal3Statuses,
} from './legal-3-options'
import type {
  Legal3Deadline,
  Legal3Labels,
  Legal3Person,
  Legal3Queue,
  Legal3Status,
} from './types'

export interface Legal3FieldContext {
  formatTime: (value: string) => string
  labels: Legal3Labels
  locale?: string
  onOpen?: (deadlineId: string) => void
  onOwnerChange?: (deadlineId: string, ownerId: string) => void
  onQueueChange?: (deadlineId: string, queue: Legal3Queue) => void
  onStatusChange?: (deadlineId: string, status: Legal3Status) => void
  owners: readonly Legal3Person[]
  queueOptions: ReturnType<typeof dataSelectOptions>
  statusOptions: ReturnType<typeof dataSelectOptions>
  timeZone?: string
}

export function createLegal3Options(labels: Legal3Labels) {
  return {
    queueOptions: dataSelectOptions(
      legal3Queues,
      labels.queues,
      legal3QueueAppearance,
    ),
    statusOptions: dataSelectOptions(
      legal3Statuses,
      labels.statuses,
      legal3StatusAppearance,
    ),
  }
}

interface FieldProps {
  context: Legal3FieldContext
  item: Legal3Deadline
  variant?: DataPropertyVariant
}

export function Legal3StatusField({ context, item, variant }: FieldProps) {
  const { labels, onStatusChange, statusOptions } = context
  return (
    <DataSelect<Legal3Status>
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

export function Legal3QueueField({ context, item, variant }: FieldProps) {
  const { labels, onQueueChange, queueOptions } = context
  return (
    <DataSelect<Legal3Queue>
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

export function Legal3OwnerField({
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

export function Legal3DueField({ context, item, variant }: FieldProps) {
  const { labels, locale, timeZone } = context
  return (
    <DataDate
      ariaLabel={labels.columns.due}
      fallback={labels.noDate}
      locale={locale}
      overdue={item.status === 'missed'}
      timeZone={timeZone}
      value={item.dueAt}
      variant={variant}
    />
  )
}
