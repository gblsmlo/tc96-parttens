import {
  LegalDate,
  LegalOwner,
  LegalSelect,
  legalSelectOptions,
} from '../shared/legal-properties'
import type { LegalPropertyVariant } from '../shared/types'
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
  queueOptions: ReturnType<typeof legalSelectOptions>
  statusOptions: ReturnType<typeof legalSelectOptions>
  timeZone?: string
}

export function createLegal3Options(labels: Legal3Labels) {
  return {
    queueOptions: legalSelectOptions(
      legal3Queues,
      labels.queues,
      legal3QueueAppearance,
    ),
    statusOptions: legalSelectOptions(
      legal3Statuses,
      labels.statuses,
      legal3StatusAppearance,
    ),
  }
}

interface FieldProps {
  context: Legal3FieldContext
  item: Legal3Deadline
  variant?: LegalPropertyVariant
}

export function Legal3StatusField({ context, item, variant }: FieldProps) {
  const { labels, onStatusChange, statusOptions } = context
  return (
    <LegalSelect<Legal3Status>
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
    <LegalSelect<Legal3Queue>
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
    <LegalOwner
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
    <LegalDate
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
