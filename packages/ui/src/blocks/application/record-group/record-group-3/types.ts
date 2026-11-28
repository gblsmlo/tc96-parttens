import type {
  DatePropertyLabels,
  PropertyOption,
  SelectPropertyLabels,
  TextPropertyLabels,
} from '@tc96/ui/patterns/properties/core'

export type RecordGroup3CatalogKey = 'source'

export type RecordGroup3Catalog = Readonly<
  Record<RecordGroup3CatalogKey, readonly PropertyOption[]>
>

export interface RecordGroup3CatalogLabels {
  source: Record<'google' | 'instagram' | 'referral', string>
}

export interface RecordGroup3Record {
  birthDate: string | null
  cpf: string | null
  occupation: string | null
  source: string | null
}

export type RecordGroup3Changes = Partial<RecordGroup3Record>

export type RecordGroup3Field = keyof RecordGroup3Record

export interface RecordGroup3Labels {
  copyCpf: string
  date: Partial<DatePropertyLabels>
  fields: Record<RecordGroup3Field, string>
  noOccupation: string
  select: Partial<SelectPropertyLabels>
  text: Partial<TextPropertyLabels>
  title: string
}

export type RecordGroup3LabelsOverride = Partial<
  Omit<RecordGroup3Labels, 'fields'>
> & {
  fields?: Partial<RecordGroup3Labels['fields']>
}

export interface RecordGroup3Props {
  catalog?: RecordGroup3Catalog
  className?: string
  labels?: RecordGroup3LabelsOverride
  locale?: string
  onRecordChange: (changes: RecordGroup3Changes) => void
  record: RecordGroup3Record
  timeZone?: string
}
