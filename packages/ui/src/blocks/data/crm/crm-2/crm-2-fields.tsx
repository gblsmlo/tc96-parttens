import { CircleIcon } from '@phosphor-icons/react'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import {
  DataDate,
  DataOwner,
  DataSelect,
} from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import { canEditCrm2Lead, canMoveCrm2Lead, crm2Origins } from './crm-2-options'
import type {
  Crm2Labels,
  Crm2Lead,
  Crm2Option,
  Crm2Origin,
  Crm2Person,
  Crm2Stage,
} from './types'

export interface Crm2FieldContext {
  formatMoney: (cents: number) => string
  labels: Crm2Labels
  locale: string
  onOpen?: (leadId: string) => void
  onOriginChange?: (leadId: string, origin: Crm2Origin) => void
  onOwnerChange?: (leadId: string, ownerId: string) => void
  onStageChange?: (leadId: string, stageId: string) => void
  owners: readonly Crm2Person[]
  stages: readonly Crm2Stage[]
  tags: readonly Crm2Option[]
  timeZone: string
}

interface FieldProps {
  context: Crm2FieldContext
  item: Crm2Lead
  variant?: DataPropertyVariant
}

const stageOptionsOf = (stages: readonly Crm2Stage[]) =>
  stages.map((stage) => ({
    icon: CircleIcon,
    label: stage.label,
    tone: stage.tone ?? 'neutral',
    value: stage.id,
  }))

export function Crm2StageField({ context, item, variant }: FieldProps) {
  const { labels, onStageChange, stages } = context
  const editable = Boolean(onStageChange) && canMoveCrm2Lead(item)
  return (
    <DataSelect<string>
      ariaLabel={labels.columns.stage}
      onChange={
        onStageChange && editable
          ? (stageId) => {
              if (stageId !== item.stageId) onStageChange(item.id, stageId)
            }
          : undefined
      }
      options={stageOptionsOf(
        editable
          ? stages.filter(
              (stage) => !stage.inactive || stage.id === item.stageId,
            )
          : stages,
      )}
      value={item.stageId}
      variant={variant}
    />
  )
}

export function Crm2OriginField({ context, item, variant }: FieldProps) {
  const { labels, onOriginChange } = context
  return (
    <DataSelect<Crm2Origin>
      ariaLabel={labels.columns.origin}
      onChange={
        onOriginChange && canEditCrm2Lead(item)
          ? (origin) => {
              if (origin !== item.origin) onOriginChange(item.id, origin)
            }
          : undefined
      }
      options={crm2Origins.map((origin) => ({
        label: labels.origins[origin],
        value: origin,
      }))}
      value={item.origin}
      variant={variant}
    />
  )
}

export function Crm2OwnerField({
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
        onOwnerChange && canEditCrm2Lead(item)
          ? (ownerId) => {
              if (ownerId !== item.ownerId) onOwnerChange(item.id, ownerId)
            }
          : undefined
      }
      owners={owners}
      placeholder={labels.unassigned}
      value={item.ownerId}
      variant={variant}
    />
  )
}

export function Crm2ContactField({ context, item }: FieldProps) {
  const { labels } = context
  return (
    <TextProperty
      ariaLabel={labels.columns.contact}
      fallback={labels.noContact}
      value={item.contact}
      variant="plain"
    />
  )
}

export function Crm2NextActionField({ context, item }: FieldProps) {
  const { labels } = context
  return (
    <TextProperty
      ariaLabel={labels.columns.nextAction}
      fallback={labels.noNextAction}
      value={item.nextAction}
      variant="plain"
    />
  )
}

export function Crm2DeadlineField({ context, item }: FieldProps) {
  const { labels, locale, timeZone } = context
  return (
    <DataDate
      ariaLabel={labels.columns.nextActionAt}
      fallback={labels.noDeadline}
      locale={locale}
      overdue={Boolean(item.nextActionAt && item.nextActionOverdue)}
      timeZone={timeZone}
      value={item.nextActionAt}
      variant="plain"
    />
  )
}

export function Crm2ValueField({ context, item }: FieldProps) {
  const { formatMoney, labels } = context
  if (item.valueCents === null)
    return <span className="text-muted-foreground">{labels.noValue}</span>
  return (
    <span className="tabular-nums" data-slot="crm-2-value">
      {formatMoney(item.valueCents)}
    </span>
  )
}

export function Crm2TagsField({ context, item }: FieldProps) {
  const { labels, tags } = context
  const options = tags
    .filter((tag) => item.tagIds.includes(tag.id))
    .map((tag) => ({ label: tag.label, value: tag.id }))
  if (options.length === 0) return null
  return (
    <TagsProperty
      ariaLabel={labels.columns.tags}
      options={options}
      readOnly
      value={options.map((option) => option.value)}
      variant="badge"
    />
  )
}
