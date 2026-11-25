import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsCatalog1Tag {
  colorClassName: string
  id: string
  leads: number
  name: string
  subtags?: SettingsCatalog1Tag[]
  tasks: number
}

export interface SettingsCatalog1Labels extends SettingsLoadLabels {
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

export type SettingsCatalog1Action = 'edit' | 'add-subtag' | 'delete'

export interface SettingsCatalog1Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<SettingsCatalog1Labels>
  onCreate?: () => void
  onTagAction?: (tagId: string, action: SettingsCatalog1Action) => void
  tags: SettingsCatalog1Tag[]
}
