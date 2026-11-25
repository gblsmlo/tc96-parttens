import type { DataTableDensity } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-types'
import type {
  TableBadgeData,
  TableColumnVisibility,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TablePerson,
  TableSettingsLabels,
  TableSort,
} from '../shared/types'

export type Table2ColumnId =
  | 'activity'
  | 'joined'
  | 'lastSeen'
  | 'location'
  | 'member'
  | 'priority'
  | 'rating'
  | 'role'
  | 'team'

export type Table2ToggleColumnId = Exclude<Table2ColumnId, 'member'>

export type Table2SortKey = 'joined' | 'lastSeen' | 'member' | 'rating' | 'role'

export type Table2Presence = 'away' | 'offline' | 'online'

export type Table2Density = DataTableDensity

export type Table2Person = TablePerson

export type Table2Badge = TableBadgeData

export interface Table2Team {
  members: Table2Person[]
  name: string
}

export interface Table2Member {
  activity: number
  email: string
  id: string
  imageUrl?: string
  isCurrentUser?: boolean
  joined: string
  lastSeen: string
  location: string
  name: string
  presence: Table2Presence
  priority: Table2Badge
  rating: number
  role: Table2Badge
  team: Table2Team
}

export type Table2Sort = TableSort<Table2SortKey>

export type Table2ColumnVisibility = TableColumnVisibility<Table2ToggleColumnId>

export interface Table2Settings {
  columnVisibility: Table2ColumnVisibility
  density: Table2Density
  showPaused: boolean
  sort: Table2Sort | null
}

export interface Table2Labels extends TableLoadLabels, TableSettingsLabels {
  activity: (percent: string) => string
  clearFilters: string
  columns: Record<Table2ColumnId, string>
  density: string
  display: string
  displayedProperties: string
  empty: string
  filterAll: string
  filters: string
  pageSize: string
  pausedMembers: string
  presence: Record<Table2Presence, string>
  rating: (rating: string) => string
  save: string
  settings: string
  sorting: string
  teamMembers: (team: string) => string
  summary: (count: number) => string
  title: string
  toolbar: string
  you: string
}

export type Table2LabelsOverride = Partial<
  Omit<Table2Labels, 'columns' | 'densities' | 'presence'>
> & {
  columns?: Partial<Table2Labels['columns']>
  densities?: Partial<Table2Labels['densities']>
  presence?: Partial<Table2Labels['presence']>
}

export interface Table2Props extends TableFormatProps, TableLoadProps {
  className?: string
  columnVisibility?: Table2ColumnVisibility
  density?: Table2Density
  labels?: Table2LabelsOverride
  members: Table2Member[]
  onColumnVisibilityChange?: (visibility: Table2ColumnVisibility) => void
  onDensityChange?: (density: Table2Density) => void
  onSave?: (settings: Table2Settings) => void
  onShowPausedChange?: (showPaused: boolean) => void
  onSortChange?: (sort: Table2Sort | null) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  showPaused?: boolean
  sort?: Table2Sort | null
}
