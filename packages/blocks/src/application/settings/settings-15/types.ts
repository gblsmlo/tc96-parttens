import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export type Settings15Direction = 'income' | 'expense'

export interface Settings15Category {
  direction: Settings15Direction
  entries: number
  id: string
  name: string
  subcategories?: Settings15Category[]
}

export interface Settings15Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  addSubcategory: string
  archive: string
  archived: string
  description: string
  direction: (direction: Settings15Direction) => string
  edit: string
  emptyDescription: string
  emptyTitle: string
  entries: (count: number) => string
  newCategory: string
  restore: string
  subcategoryOf: (parent: string) => string
  title: string
}

export type Settings15Action =
  | 'edit'
  | 'add-subcategory'
  | 'archive'
  | 'restore'

export interface Settings15Props extends SettingsLoadProps {
  archivedCategories?: Settings15Category[]
  categories: Settings15Category[]
  className?: string
  labels?: Partial<Settings15Labels>
  onCategoryAction?: (categoryId: string, action: Settings15Action) => void
  onCreate?: () => void
}
