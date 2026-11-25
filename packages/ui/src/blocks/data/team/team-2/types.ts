import type { DataTableDensity } from '@tc96/ui/patterns/data-table/data-table-types'
import type { DataPriority } from '../../shared/properties/data-priority'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  TableColumnVisibility,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TablePerson,
  TableSettingsLabels,
  TableSort,
} from '../../shared/table/types'

export type Team2ColumnId =
  | 'activity'
  | 'joined'
  | 'lastSeen'
  | 'location'
  | 'member'
  | 'priority'
  | 'rating'
  | 'role'
  | 'team'

export type Team2ToggleColumnId = Exclude<Team2ColumnId, 'member'>

export type Team2SortKey = 'joined' | 'lastSeen' | 'member' | 'rating' | 'role'

export type Team2Presence = 'away' | 'offline' | 'online'

export type Team2Density = DataTableDensity

export type Team2Person = TablePerson

export type Team2Priority = DataPriority

export interface Team2Role {
  label: string
  tone?: DataOptionAppearance['tone']
}

export interface Team2Team {
  members: Team2Person[]
  name: string
}

export interface Team2Member {
  activity: number
  email: string
  id: string
  imageUrl?: string
  isCurrentUser?: boolean
  joined: string
  lastSeen: string
  location: string
  name: string
  presence: Team2Presence
  priority: Team2Priority
  rating: number
  role: Team2Role
  team: Team2Team
}

export type Team2Sort = TableSort<Team2SortKey>

export type Team2ColumnVisibility = TableColumnVisibility<Team2ToggleColumnId>

export interface Team2Settings {
  columnVisibility: Team2ColumnVisibility
  density: Team2Density
  showPaused: boolean
  sort: Team2Sort | null
}

export interface Team2Labels extends TableLoadLabels, TableSettingsLabels {
  activity: (percent: string) => string
  clearFilters: string
  columns: Record<Team2ColumnId, string>
  density: string
  display: string
  displayedProperties: string
  empty: string
  filterAll: string
  filters: string
  pageSize: string
  pausedMembers: string
  presence: Record<Team2Presence, string>
  priorities: Record<Team2Priority, string>
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

export type Team2LabelsOverride = Partial<
  Omit<Team2Labels, 'columns' | 'densities' | 'presence' | 'priorities'>
> & {
  columns?: Partial<Team2Labels['columns']>
  densities?: Partial<Team2Labels['densities']>
  presence?: Partial<Team2Labels['presence']>
  priorities?: Partial<Team2Labels['priorities']>
}

export interface Team2Props extends TableFormatProps, TableLoadProps {
  className?: string
  columnVisibility?: Team2ColumnVisibility
  density?: Team2Density
  labels?: Team2LabelsOverride
  members: Team2Member[]
  onColumnVisibilityChange?: (visibility: Team2ColumnVisibility) => void
  onDensityChange?: (density: Team2Density) => void
  onSave?: (settings: Team2Settings) => void
  onShowPausedChange?: (showPaused: boolean) => void
  onSortChange?: (sort: Team2Sort | null) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  showPaused?: boolean
  sort?: Team2Sort | null
}
