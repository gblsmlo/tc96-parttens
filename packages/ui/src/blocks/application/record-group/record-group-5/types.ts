import type {
  PropertyOption,
  SelectPropertyLabels,
} from '@tc96/ui/patterns/properties/core'

export type RecordGroup5Status = 'draft' | 'published'

export type RecordGroup5Field =
  | 'expectedTarget'
  | 'primaryObjective'
  | 'secondaryObjective'

export type RecordGroup5Objective =
  | 'new-appointments'
  | 'practice-area'
  | 'referrals'

export type RecordGroup5Target = 'booked-appointment' | 'whatsapp-conversation'

export type RecordGroup5Values = Record<RecordGroup5Field, string | null>

export interface RecordGroup5Version {
  number: number
  savedAt: string
  status: RecordGroup5Status
  values: RecordGroup5Values
}

export interface RecordGroup5StatusMeta {
  color: string
  label: string
}

export interface RecordGroup5Catalog {
  objective: readonly PropertyOption[]
  status: Readonly<Record<RecordGroup5Status, RecordGroup5StatusMeta>>
  target: readonly PropertyOption[]
}

export interface RecordGroup5CatalogLabels {
  objective: Record<RecordGroup5Objective, string>
  status: Record<RecordGroup5Status, string>
  target: Record<RecordGroup5Target, string>
}

export interface RecordGroup5Labels {
  close: string
  draftSaved: (savedAt: string) => string
  empty: Record<RecordGroup5Field, string>
  fieldOfVersion: (field: string, number: number) => string
  fields: Record<RecordGroup5Field, string>
  publishedOn: (savedAt: string) => string
  select: Partial<SelectPropertyLabels>
  title: string
  version: (number: number) => string
}

export type RecordGroup5LabelsOverride = Partial<
  Omit<RecordGroup5Labels, 'empty' | 'fields'>
> & {
  empty?: Partial<RecordGroup5Labels['empty']>
  fields?: Partial<RecordGroup5Labels['fields']>
}

export interface RecordGroup5Props {
  catalog?: RecordGroup5Catalog
  className?: string
  finalFocus?: () => HTMLElement | null
  labels?: RecordGroup5LabelsOverride
  onOpenVersionChange: (number: number | null) => void
  openVersion: number | null
  versions: readonly RecordGroup5Version[]
}
