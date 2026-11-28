export type RecordGroup6LinkKind = 'file' | 'record'

export type RecordGroup6Status = 'overdue' | 'paid' | 'scheduled'

export type RecordGroup6StatusTone = 'danger' | 'success' | 'warning'

export interface RecordGroup6StatusMeta {
  label: string
  tone: RecordGroup6StatusTone
}

export interface RecordGroup6Catalog {
  status: Readonly<Record<RecordGroup6Status, RecordGroup6StatusMeta>>
}

export interface RecordGroup6CatalogLabels {
  status: Record<RecordGroup6Status, string>
}

export interface RecordGroup6Link {
  href: string
  id: string
  kind: RecordGroup6LinkKind
  label: string
  meta?: string
  status?: RecordGroup6Status
}

export interface RecordGroup6Labels {
  empty: string
  title: string
}

export type RecordGroup6LabelsOverride = Partial<RecordGroup6Labels>

export interface RecordGroup6Props {
  catalog?: RecordGroup6Catalog
  className?: string
  labels?: RecordGroup6LabelsOverride
  links: readonly RecordGroup6Link[]
}
