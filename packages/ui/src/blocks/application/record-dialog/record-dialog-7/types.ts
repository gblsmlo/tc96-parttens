import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export type RecordDialog7Person = PersonPropertyOption

export type RecordDialog7DateField = 'startDate' | 'targetDate'

export interface RecordDialog7Values {
  description: string
  lead: string | null
  priority: string
  repos: string[]
  startDate: string | null
  status: string
  targetDate: string | null
  title: string
}

export interface RecordDialog7Labels {
  cancel: string
  createMore: string
  date: { clear: string; fallback: string }
  description: string
  descriptionPlaceholder: string
  lead: string
  moreProperties: string
  openAsPage: string
  priority: string
  priorityHigh: string
  priorityLow: string
  priorityMedium: string
  priorityNone: string
  priorityUrgent: string
  repos: string
  saveFailed: string
  startDate: string
  status: string
  statusBacklog: string
  statusCanceled: string
  statusCompleted: string
  statusInProgress: string
  statusPlanned: string
  submit: string
  submitting: string
  targetDate: string
  title: string
  titleAncestor: string
  titleLabel: string
  titlePlaceholder: string
  titleText: string
}

export interface RecordDialog7Props {
  className?: string
  labels?: Partial<RecordDialog7Labels>
  onCreate: (values: RecordDialog7Values) => void | Promise<void>
  onOpenAsPage?: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
  people: readonly RecordDialog7Person[]
  priorityOptions?: readonly PropertyOption[]
  repos: readonly string[]
  statusOptions?: readonly PropertyOption[]
}
