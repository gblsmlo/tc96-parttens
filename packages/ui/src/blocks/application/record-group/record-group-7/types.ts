import type {
  DatePropertyLabels,
  PropertyOption,
  SelectPropertyLabels,
} from '@tc96/ui/patterns/properties/core'

export type RecordGroup7Method = 'boleto' | 'card' | 'pix'

export type RecordGroup7Field = 'dueAt' | 'issuedAt' | 'method'

export type RecordGroup7CatalogKey = 'method'

export type RecordGroup7Catalog = Readonly<
  Record<RecordGroup7CatalogKey, readonly PropertyOption[]>
>

export interface RecordGroup7CatalogLabels {
  method: Record<RecordGroup7Method, string>
}

export interface RecordGroup7Record {
  dueAt: string | null
  issuedAt: string | null
  method: string | null
}

export interface RecordGroup7Labels {
  date: Partial<DatePropertyLabels>
  fields: Record<RecordGroup7Field, string>
  issue: string
  issuedOn: (date: string) => string
  noMethod: string
  notIssued: string
  reissue: string
  select: Partial<SelectPropertyLabels>
  title: string
}

export type RecordGroup7LabelsOverride = Partial<
  Omit<RecordGroup7Labels, 'fields'>
> & {
  fields?: Partial<RecordGroup7Labels['fields']>
}

export interface RecordGroup7Props {
  catalog?: RecordGroup7Catalog
  className?: string
  labels?: RecordGroup7LabelsOverride
  locale?: string
  onIssue: () => void
  onMethodChange: (method: string | null) => void
  record: RecordGroup7Record
  timeZone?: string
}
