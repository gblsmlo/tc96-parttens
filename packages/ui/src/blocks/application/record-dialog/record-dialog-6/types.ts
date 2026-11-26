import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export type RecordDialog6Person = PersonPropertyOption

export type RecordDialog6FieldId =
  | 'number'
  | 'action'
  | 'subject'
  | 'venue'
  | 'division'
  | 'instance'
  | 'partyName'
  | 'partyRole'
  | 'partyContact'
  | 'owner'
  | 'phase'
  | 'contract'
  | 'monitor'

export type RecordDialog6SectionId = 'lawsuit' | 'party' | 'office' | 'settings'

export type RecordDialog6Values = Record<
  RecordDialog6FieldId,
  string | boolean | null
>

export interface RecordDialog6Text {
  fallback: string
  label: string
}

export interface RecordDialog6SectionText {
  description: string
  title: string
}

export interface RecordDialog6Labels {
  cancel: string
  description: string
  fields: Record<RecordDialog6FieldId, RecordDialog6Text>
  sections: Record<RecordDialog6SectionId, RecordDialog6SectionText>
  statusDone: string
  statusPending: string
  statusProgress: string
  submit: string
  submitting: string
  title: string
  titleAncestor: string
}

export interface RecordDialog6Props {
  className?: string
  clients: readonly RecordDialog6Person[]
  contractOptions: readonly PropertyOption[]
  initialValues?: Partial<RecordDialog6Values>
  instanceOptions: readonly PropertyOption[]
  labels?: Partial<RecordDialog6Labels>
  onCreate: (values: RecordDialog6Values) => void | Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  owners: readonly RecordDialog6Person[]
  partyRoleOptions: readonly PropertyOption[]
  phaseOptions: readonly PropertyOption[]
}
