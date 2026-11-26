import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor/rich-text-editor'

export type RecordDialog5Person = PersonPropertyOption

export interface RecordDialog5Values {
  body: RichTextValue
  priority: string
  responsible: string | null
  status: string
  title: string
}

export interface RecordDialog5Note extends RecordDialog5Values {
  id: string
}

export interface RecordDialog5Labels {
  bodyLabel: string
  bodyPlaceholder: string
  copyLink: string
  create: string
  creating: string
  editTitle: string
  newTitle: string
  priority: string
  priorityHigh: string
  priorityLow: string
  priorityMedium: string
  priorityNone: string
  priorityUrgent: string
  responsible: string
  save: string
  saveFailed: string
  saving: string
  status: string
  statusBacklog: string
  statusCanceled: string
  statusCompleted: string
  statusInProgress: string
  statusPlanned: string
  titleLabel: string
  titlePlaceholder: string
}

export interface RecordDialog5Props {
  className?: string
  labels?: Partial<RecordDialog5Labels>
  note?: RecordDialog5Note | null
  onCopyLink?: (id: string) => void
  onOpenChange: (open: boolean) => void
  onSave: (values: RecordDialog5Values) => void | Promise<void>
  open: boolean
  people: readonly RecordDialog5Person[]
  priorityOptions?: readonly PropertyOption[]
  recordName: string
  statusOptions?: readonly PropertyOption[]
}
