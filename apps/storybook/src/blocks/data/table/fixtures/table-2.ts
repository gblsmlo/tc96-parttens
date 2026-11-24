import type {
  Table2ColumnVisibility,
  Table2Member,
  Table2Settings,
  Table2Sort,
  Table2View,
} from '@tc96/ui/blocks/data/table/table-2'
import * as source from '../../data-grid/fixtures/data-grid-2.ts'

export interface Table2SavedView extends Table2View {
  settings: Table2Settings
}

export const members: Table2Member[] = source.members
export const initialSort: Table2Sort = source.initialSort
export const defaultVisibility: Table2ColumnVisibility =
  source.defaultVisibility
export const pageSizeOptions: number[] = source.pageSizeOptions
export const factorySettings: Table2Settings = source.factorySettings
export const views: Table2SavedView[] = source.views
