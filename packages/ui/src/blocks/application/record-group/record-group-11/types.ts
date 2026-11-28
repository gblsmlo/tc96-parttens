export interface RecordGroup11Author {
  avatarUrl?: string
  initials: string
  name: string
}

export interface RecordGroup11Note {
  author: RecordGroup11Author
  id: string
  preview: string
  title: string
  updatedAt: string
}

export interface RecordGroup11Labels {
  create: string
  emptyPreview: string
  justNow: string
  title: string
  untitled: string
  viewAll: string
}

export type RecordGroup11LabelsOverride = Partial<RecordGroup11Labels>

export interface RecordGroup11Props {
  className?: string
  labels?: RecordGroup11LabelsOverride
  locale?: string
  notes: readonly RecordGroup11Note[]
  now?: Date
  onCreate?: () => void
  onOpenNote: (id: string) => void
  onViewAll?: () => void
}
