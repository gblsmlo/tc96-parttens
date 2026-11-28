import type {
  PropertyOption,
  SelectPropertyLabels,
} from '@tc96/ui/patterns/properties/core'

export type RecordGroup8Interest = 'banking' | 'family' | 'labor'

export type RecordGroup8Urgency = 'high' | 'low' | 'medium'

export type RecordGroup8Field = 'interest' | 'urgency'

export type RecordGroup8CatalogKey = 'interest' | 'urgency'

export type RecordGroup8Catalog = Readonly<
  Record<RecordGroup8CatalogKey, readonly PropertyOption[]>
>

export interface RecordGroup8CatalogLabels {
  interest: Record<RecordGroup8Interest, string>
  urgency: Record<RecordGroup8Urgency, string>
}

export interface RecordGroup8Record {
  interest: string | null
  urgency: string | null
}

export type RecordGroup8Changes = Partial<RecordGroup8Record>

export interface RecordGroup8Link {
  href: string
  label: string
  meta?: string
}

export interface RecordGroup8Labels {
  fields: Record<RecordGroup8Field, string>
  noInterest: string
  noUrgency: string
  select: Partial<SelectPropertyLabels>
  title: string
}

export type RecordGroup8LabelsOverride = Partial<
  Omit<RecordGroup8Labels, 'fields'>
> & {
  fields?: Partial<RecordGroup8Labels['fields']>
}

export interface RecordGroup8Props {
  catalog?: RecordGroup8Catalog
  className?: string
  labels?: RecordGroup8LabelsOverride
  link?: RecordGroup8Link
  onRecordChange: (changes: RecordGroup8Changes) => void
  record: RecordGroup8Record
}
