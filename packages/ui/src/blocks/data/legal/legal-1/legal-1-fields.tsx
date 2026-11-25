import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import {
  DataDate,
  DataOwner,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import {
  legal1QueueAppearance,
  legal1Queues,
  legal1StatusAppearance,
  legal1Statuses,
} from './legal-1-options'
import type {
  Legal1Case,
  Legal1Labels,
  Legal1Person,
  Legal1Queue,
  Legal1Status,
} from './types'

export interface Legal1FieldContext {
  labels: Legal1Labels
  locale?: string
  onOpen?: (caseId: string) => void
  onOwnerChange?: (caseId: string, ownerId: string) => void
  onQueueChange?: (caseId: string, queue: Legal1Queue) => void
  onStatusChange?: (caseId: string, status: Legal1Status) => void
  owners: readonly Legal1Person[]
  queueOptions: ReturnType<typeof dataSelectOptions>
  statusOptions: ReturnType<typeof dataSelectOptions>
  timeZone?: string
}

export function createLegal1Options(labels: Legal1Labels) {
  return {
    queueOptions: dataSelectOptions(
      legal1Queues,
      labels.queues,
      legal1QueueAppearance,
    ),
    statusOptions: dataSelectOptions(
      legal1Statuses,
      labels.statuses,
      legal1StatusAppearance,
    ),
  }
}

interface FieldProps {
  context: Legal1FieldContext
  item: Legal1Case
  variant?: DataPropertyVariant
}

export function Legal1StatusField({ context, item, variant }: FieldProps) {
  const { labels, onStatusChange, statusOptions } = context
  return (
    <DataSelect<Legal1Status>
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

export function Legal1QueueField({ context, item, variant }: FieldProps) {
  const { labels, onQueueChange, queueOptions } = context
  return (
    <DataSelect<Legal1Queue>
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

export function Legal1OwnerField({
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

export function Legal1DeadlineField({ context, item, variant }: FieldProps) {
  const { labels, locale, timeZone } = context
  return (
    <DataDate
      ariaLabel={labels.columns.deadline}
      fallback={labels.noDeadline}
      locale={locale}
      timeZone={timeZone}
      value={item.nextDeadline}
      variant={variant}
    />
  )
}

export function Legal1NumberField({ context, item, variant }: FieldProps) {
  const { labels } = context
  return (
    <TextProperty
      ariaLabel={labels.columns.number}
      trailingVisibility="always"
      value={item.number}
      variant={variant}
      copyable
      labels={{ copy: labels.copyNumber, fallback: labels.noNumber }}
    />
  )
}
