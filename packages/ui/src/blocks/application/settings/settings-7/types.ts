import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings7Tag {
  colorClassName: string
  id: string
  leads: number
  name: string
  subtags?: Settings7Tag[]
  tasks: number
}

export interface Settings7Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  addSubtag: string
  delete: string
  description: string
  edit: string
  emptyDescription: string
  emptyTitle: string
  newTag: string
  subtagOf: (parent: string) => string
  usage: (leads: number, tasks: number) => string
  title: string
}

export type Settings7Action = 'edit' | 'add-subtag' | 'delete'

export interface Settings7Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<Settings7Labels>
  onCreate?: () => void
  onTagAction?: (tagId: string, action: Settings7Action) => void
  tags: Settings7Tag[]
}
