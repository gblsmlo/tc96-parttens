import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import type {
  GridBadgeData,
  GridColumnVisibility,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridPerson,
  GridSettingsLabels,
  GridSort,
} from '../shared/types'

export type DataGrid2ColumnId =
  | 'activity'
  | 'joined'
  | 'lastSeen'
  | 'location'
  | 'member'
  | 'priority'
  | 'rating'
  | 'role'
  | 'team'

export type DataGrid2ToggleColumnId = Exclude<DataGrid2ColumnId, 'member'>

export type DataGrid2SortKey =
  | 'joined'
  | 'lastSeen'
  | 'member'
  | 'rating'
  | 'role'

export type DataGrid2Presence = 'away' | 'offline' | 'online'

export type DataGrid2Density = NonNullable<
  UseDataGridOptions<DataGrid2Member>['density']
>

export type DataGrid2Person = GridPerson

export type DataGrid2Badge = GridBadgeData

export interface DataGrid2Team {
  members: DataGrid2Person[]
  name: string
}

export interface DataGrid2Member {
  activity: number
  email: string
  id: string
  imageUrl?: string
  isCurrentUser?: boolean
  joined: string
  lastSeen: string
  location: string
  name: string
  presence: DataGrid2Presence
  priority: DataGrid2Badge
  rating: number
  role: DataGrid2Badge
  team: DataGrid2Team
}

export type DataGrid2Sort = GridSort<DataGrid2SortKey>

export type DataGrid2ColumnVisibility =
  GridColumnVisibility<DataGrid2ToggleColumnId>

export interface DataGrid2Settings {
  columnVisibility: DataGrid2ColumnVisibility
  density: DataGrid2Density
  showPaused: boolean
  sort: DataGrid2Sort | null
}

export interface DataGrid2Labels extends GridLoadLabels, GridSettingsLabels {
  activity: (percent: string) => string
  clearFilters: string
  columns: Record<DataGrid2ColumnId, string>
  density: string
  display: string
  displayedProperties: string
  empty: string
  filterAll: string
  filters: string
  pageSize: string
  pausedMembers: string
  presence: Record<DataGrid2Presence, string>
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

export type DataGrid2LabelsOverride = Partial<
  Omit<DataGrid2Labels, 'columns' | 'densities' | 'presence'>
> & {
  columns?: Partial<DataGrid2Labels['columns']>
  densities?: Partial<DataGrid2Labels['densities']>
  presence?: Partial<DataGrid2Labels['presence']>
}

export interface DataGrid2Props extends GridFormatProps, GridLoadProps {
  className?: string
  columnVisibility?: DataGrid2ColumnVisibility
  density?: DataGrid2Density
  labels?: DataGrid2LabelsOverride
  members: DataGrid2Member[]
  onColumnVisibilityChange?: (visibility: DataGrid2ColumnVisibility) => void
  onDensityChange?: (density: DataGrid2Density) => void
  onSave?: (settings: DataGrid2Settings) => void
  onShowPausedChange?: (showPaused: boolean) => void
  onSortChange?: (sort: DataGrid2Sort | null) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  showPaused?: boolean
  sort?: DataGrid2Sort | null
}
