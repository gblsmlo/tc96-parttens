import type { ChecklistItem } from '@tc96/ui/patterns/checklist/core'

export type RecordGroup1Item = ChecklistItem

export interface RecordGroup1Labels {
  addLabel: string
  checklist: string
  title: string
}

export type RecordGroup1LabelsOverride = Partial<RecordGroup1Labels>

export interface RecordGroup1Props {
  className?: string
  items: readonly RecordGroup1Item[]
  labels?: RecordGroup1LabelsOverride
  locale?: string
  newItemTitle: string
  onCreate: (title: string, completed: boolean) => void
  onItemCompletionChange: (id: string, completed: boolean) => void
  onItemDelete: (id: string) => void
  onItemMove: (id: string, targetIndex: number) => void
  onItemRename: (id: string, title: string) => void
  onNewItemTitleChange: (title: string) => void
}
