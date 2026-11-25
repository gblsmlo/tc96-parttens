import {
  LegalDate,
  LegalOwner,
  LegalSelect,
  legalSelectOptions,
} from '../shared/legal-properties'
import type { LegalPropertyVariant } from '../shared/types'
import {
  legal4QueueAppearance,
  legal4Queues,
  legal4StatusAppearance,
  legal4Statuses,
} from './legal-4-options'
import type {
  Legal4Client,
  Legal4Labels,
  Legal4Person,
  Legal4Queue,
  Legal4Status,
} from './types'

export interface Legal4FieldContext {
  labels: Legal4Labels
  locale?: string
  onOpen?: (clientId: string) => void
  onOwnerChange?: (clientId: string, ownerId: string) => void
  onQueueChange?: (clientId: string, queue: Legal4Queue) => void
  onStatusChange?: (clientId: string, status: Legal4Status) => void
  owners: readonly Legal4Person[]
  queueOptions: ReturnType<typeof legalSelectOptions>
  statusOptions: ReturnType<typeof legalSelectOptions>
  timeZone?: string
}

export function createLegal4Options(labels: Legal4Labels) {
  return {
    queueOptions: legalSelectOptions(
      legal4Queues,
      labels.queues,
      legal4QueueAppearance,
    ),
    statusOptions: legalSelectOptions(
      legal4Statuses,
      labels.statuses,
      legal4StatusAppearance,
    ),
  }
}

interface FieldProps {
  context: Legal4FieldContext
  item: Legal4Client
  variant?: LegalPropertyVariant
}

export function Legal4StatusField({ context, item, variant }: FieldProps) {
  const { labels, onStatusChange, statusOptions } = context
  return (
    <LegalSelect<Legal4Status>
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

export function Legal4QueueField({ context, item, variant }: FieldProps) {
  const { labels, onQueueChange, queueOptions } = context
  return (
    <LegalSelect<Legal4Queue>
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

export function Legal4OwnerField({
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

export function Legal4SinceField({ context, item, variant }: FieldProps) {
  const { labels, locale, timeZone } = context
  return (
    <LegalDate
      ariaLabel={labels.columns.since}
      fallback={labels.noDate}
      locale={locale}
      timeZone={timeZone}
      value={item.clientSince}
      variant={variant}
    />
  )
}
