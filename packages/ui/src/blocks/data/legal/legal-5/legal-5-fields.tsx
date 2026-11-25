import { BoxArrowUpIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { PeopleProperty } from '@tc96/ui/patterns/properties/display/people/people-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { DataOwner, DataSelect } from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import type {
  Legal5DeadlineTone,
  Legal5Labels,
  Legal5Option,
  Legal5Person,
  Legal5Phase,
  Legal5Record,
} from './types'

export interface Legal5FieldContext {
  labels: Legal5Labels
  onOpen?: (recordId: string) => void
  onOwnerChange?: (recordId: string, ownerId: string) => void
  onPhaseChange?: (recordId: string, phaseId: string) => void
  onTagsChange?: (recordId: string, tagIds: string[]) => void
  onUnarchive?: (recordId: string) => void
  owners: readonly Legal5Person[]
  phases: readonly Legal5Phase[]
  tags: readonly Legal5Option[]
  tagsLoading?: boolean
}

interface FieldProps {
  context: Legal5FieldContext
  item: Legal5Record
  variant?: DataPropertyVariant
}

const deadlineToneClass: Record<Legal5DeadlineTone, string> = {
  danger: 'text-destructive-foreground',
  neutral: 'text-muted-foreground',
  warning: 'text-warning-foreground',
}

export function Legal5PhaseField({
  context,
  item,
  readOnly = false,
  variant,
}: FieldProps & { readOnly?: boolean }) {
  const { labels, onPhaseChange, phases } = context
  return (
    <DataSelect<string>
      ariaLabel={labels.columns.phase}
      onChange={
        onPhaseChange && !readOnly
          ? (phaseId) => {
              if (phaseId !== item.phaseId) onPhaseChange(item.id, phaseId)
            }
          : undefined
      }
      options={phases
        .filter((phase) => !phase.kind || phase.kind === item.kind)
        .map((phase) => ({ label: phase.label, value: phase.id }))}
      value={item.phaseId}
      variant={variant}
    />
  )
}

export function Legal5OwnerField({
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
        onOwnerChange
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

export function Legal5NumberField({ context, item, variant }: FieldProps) {
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

export function Legal5DeadlineField({
  item,
}: Readonly<{ item: Legal5Record }>) {
  if (!item.nextDeadline) return null
  return (
    <span
      className={deadlineToneClass[item.nextDeadline.tone]}
      data-slot="legal-5-deadline"
      data-tone={item.nextDeadline.tone}
    >
      {item.nextDeadline.label}
    </span>
  )
}

export function Legal5ClientsField({ context, item }: FieldProps) {
  const names = [...new Set(item.clients)]
  if (names.length === 0) return null
  return (
    <PeopleProperty
      ariaLabel={context.labels.columns.clients}
      options={names.map((name) => ({ label: name, value: name }))}
      readOnly
      value={names}
      variant="plain"
    />
  )
}

export function Legal5TagsField({ context, item }: FieldProps) {
  const { labels, onTagsChange, tags, tagsLoading } = context
  if (onTagsChange)
    return (
      <TagsProperty
        ariaLabel={labels.columns.tags}
        className="w-auto"
        isLoading={tagsLoading}
        labels={labels.tagPicker}
        onValueChange={(tagIds) => onTagsChange(item.id, [...tagIds])}
        options={tags.map((tag) => ({ label: tag.label, value: tag.id }))}
        value={item.tagIds}
        variant="badge"
      />
    )
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

export const hasLegal5KindMark = (item: Legal5Record) =>
  item.kind === 'matter' || item.archived

export const canUnarchiveLegal5 = (
  context: Legal5FieldContext,
  item: Legal5Record,
) => Boolean(context.onUnarchive) && item.archived && item.kind === 'lawsuit'

export function Legal5KindMark({ context, item }: FieldProps) {
  const { labels } = context
  return (
    <>
      {item.kind === 'matter' ? (
        <Badge variant="outline">{labels.caseTag}</Badge>
      ) : null}
      {item.archived ? (
        <span className="shrink-0 text-muted-foreground">
          {labels.archived}
        </span>
      ) : null}
    </>
  )
}

export function Legal5UnarchiveButton({ context, item }: FieldProps) {
  const { labels, onUnarchive } = context
  if (!onUnarchive || !canUnarchiveLegal5(context, item)) return null
  return (
    <Button
      aria-label={labels.unarchiveRecord(item.title)}
      onClick={(event) => {
        event.stopPropagation()
        onUnarchive(item.id)
      }}
      size="sm"
      type="button"
      variant="ghost"
    >
      <BoxArrowUpIcon aria-hidden="true" />
      {labels.unarchive}
    </Button>
  )
}
