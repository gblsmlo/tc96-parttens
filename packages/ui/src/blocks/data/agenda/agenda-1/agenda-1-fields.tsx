import { XCircleIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import type { SelectPropertyOption } from '@tc96/ui/patterns/properties/display/select/select-property'
import {
  DataOwner,
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import type { Agenda1Formatters } from './agenda-1-calendar'
import {
  agenda1KindAppearance,
  agenda1Kinds,
  agenda1Modalities,
  agenda1ModalityAppearance,
} from './agenda-1-options'
import type {
  Agenda1Entry,
  Agenda1Kind,
  Agenda1Labels,
  Agenda1Modality,
  Agenda1Person,
} from './types'

export interface Agenda1FieldContext {
  formatters: Agenda1Formatters
  kindOptions: SelectPropertyOption[]
  labels: Agenda1Labels
  modalityOptions: SelectPropertyOption[]
  onCancel?: (entryId: string) => void
  onOpen?: (entry: Agenda1Entry) => void
  owners: readonly Agenda1Person[]
}

export function createAgenda1Options(labels: Agenda1Labels) {
  return {
    kindOptions: dataSelectOptions(
      agenda1Kinds,
      labels.kinds,
      agenda1KindAppearance,
    ),
    modalityOptions: dataSelectOptions(
      agenda1Modalities,
      labels.modalities,
      agenda1ModalityAppearance,
    ),
  }
}

interface FieldProps {
  context: Agenda1FieldContext
  entry: Agenda1Entry
}

export const agenda1WhenOf = ({ context, entry }: FieldProps) =>
  context.formatters.when(entry, context.labels.allDay)

export const agenda1CaptionOf = ({ context, entry }: FieldProps) => [
  ...agenda1WhenOf({ context, entry }),
  ...(entry.caption ? [entry.caption] : []),
]

export function Agenda1KindField({ context, entry }: FieldProps) {
  return (
    <DataSelect<Agenda1Kind>
      ariaLabel={context.labels.columns.kind}
      options={context.kindOptions}
      value={entry.kind}
    />
  )
}

export function Agenda1ModalityField({ context, entry }: FieldProps) {
  if (!entry.modality) return null
  return (
    <DataSelect<Agenda1Modality>
      ariaLabel={context.labels.columns.modality}
      options={context.modalityOptions}
      value={entry.modality}
    />
  )
}

export function Agenda1OwnerField({
  avatarOnly,
  context,
  entry,
}: FieldProps & { avatarOnly?: boolean }) {
  const { labels, owners } = context
  if (owners.length === 0) return null
  return (
    <DataOwner
      ariaLabel={labels.columns.owner}
      avatarOnly={avatarOnly}
      owners={owners}
      placeholder={labels.unassigned}
      value={entry.ownerId ?? null}
    />
  )
}

export function Agenda1CompletedMark({ context, entry }: FieldProps) {
  if (!entry.completed) return null
  return (
    <span className="shrink-0 text-muted-foreground">
      {context.labels.completed}
    </span>
  )
}

export const canCancelAgenda1 = (
  context: Agenda1FieldContext,
  entry: Agenda1Entry,
) =>
  Boolean(context.onCancel) && entry.kind === 'appointment' && !entry.completed

export function Agenda1CancelButton({ context, entry }: FieldProps) {
  const { labels, onCancel } = context
  if (!onCancel || !canCancelAgenda1(context, entry)) return null
  return (
    <Button
      aria-label={labels.cancelEntry(entry.title)}
      onClick={(event) => {
        event.stopPropagation()
        onCancel(entry.id)
      }}
      size="sm"
      type="button"
      variant="ghost"
    >
      <XCircleIcon aria-hidden="true" />
      {labels.cancel}
    </Button>
  )
}
