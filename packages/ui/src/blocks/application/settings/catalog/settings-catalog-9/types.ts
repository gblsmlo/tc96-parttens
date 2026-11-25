import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export type SettingsCatalog9Direction = 'income' | 'expense'

export interface SettingsCatalog9Category {
  direction: SettingsCatalog9Direction
  entries: number
  id: string
  name: string
  subcategories?: SettingsCatalog9Category[]
}

export interface SettingsCatalog9Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  addSubcategory: string
  archive: string
  archived: string
  description: string
  direction: (direction: SettingsCatalog9Direction) => string
  edit: string
  emptyDescription: string
  emptyTitle: string
  entries: (count: number) => string
  newCategory: string
  restore: string
  subcategoryOf: (parent: string) => string
  title: string
}

export type SettingsCatalog9Action =
  | 'edit'
  | 'add-subcategory'
  | 'archive'
  | 'restore'

export interface SettingsCatalog9Props extends SettingsLoadProps {
  archivedCategories?: SettingsCatalog9Category[]
  categories: SettingsCatalog9Category[]
  className?: string
  labels?: Partial<SettingsCatalog9Labels>
  onCategoryAction?: (
    categoryId: string,
    action: SettingsCatalog9Action,
  ) => void
  onCreate?: () => void
}
