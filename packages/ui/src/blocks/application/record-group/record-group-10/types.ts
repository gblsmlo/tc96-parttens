export interface RecordGroup10Actor {
  avatarUrl?: string
  initials: string
  name: string
}

export interface RecordGroup10Entry {
  actor: RecordGroup10Actor
  at: string
  id: string
  object?: string
  preposition?: string
  subject?: string
  timeLabel: string
  verb: string
}

export interface RecordGroup10Labels {
  title: string
  viewAll: string
}

export type RecordGroup10LabelsOverride = Partial<RecordGroup10Labels>

export interface RecordGroup10Props {
  className?: string
  entries: readonly RecordGroup10Entry[]
  labels?: RecordGroup10LabelsOverride
  onViewAll?: () => void
}
