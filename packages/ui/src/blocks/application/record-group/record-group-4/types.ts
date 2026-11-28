import type {
  PropertyOption,
  SelectPropertyLabels,
} from '@tc96/ui/patterns/properties/core'

export type RecordGroup4Status = 'draft' | 'published'

export type RecordGroup4Field =
  | 'expectedTarget'
  | 'primaryObjective'
  | 'secondaryObjective'

export type RecordGroup4Objective =
  | 'new-appointments'
  | 'practice-area'
  | 'referrals'

export type RecordGroup4Target = 'booked-appointment' | 'whatsapp-conversation'

export type RecordGroup4Values = Record<RecordGroup4Field, string | null>

export type RecordGroup4Changes = Partial<RecordGroup4Values>

export interface RecordGroup4Version {
  number: number
  savedAt: string
  status: RecordGroup4Status
  values: RecordGroup4Values
}

export interface RecordGroup4StatusMeta {
  color: string
  label: string
}

export interface RecordGroup4Catalog {
  objective: readonly PropertyOption[]
  status: Readonly<Record<RecordGroup4Status, RecordGroup4StatusMeta>>
  target: readonly PropertyOption[]
}

export interface RecordGroup4CatalogLabels {
  objective: Record<RecordGroup4Objective, string>
  status: Record<RecordGroup4Status, string>
  target: Record<RecordGroup4Target, string>
}

export interface RecordGroup4Labels {
  close: string
  draftSaved: (savedAt: string) => string
  empty: Record<RecordGroup4Field, string>
  fields: Record<RecordGroup4Field, string>
  publish: string
  published: (number: number, savedAt: string) => string
  saveDraft: string
  select: Partial<SelectPropertyLabels>
  title: string
  unsaved: string
}

export type RecordGroup4LabelsOverride = Partial<
  Omit<RecordGroup4Labels, 'empty' | 'fields'>
> & {
  empty?: Partial<RecordGroup4Labels['empty']>
  fields?: Partial<RecordGroup4Labels['fields']>
}

export interface RecordGroup4Props {
  catalog?: RecordGroup4Catalog
  className?: string
  finalFocus?: () => HTMLElement | null
  labels?: RecordGroup4LabelsOverride
  onOpenChange: (open: boolean) => void
  onPublish: () => void
  onSaveDraft: () => void
  onValuesChange: (changes: RecordGroup4Changes) => void
  open: boolean
  values: RecordGroup4Values
  versions: readonly RecordGroup4Version[]
}
