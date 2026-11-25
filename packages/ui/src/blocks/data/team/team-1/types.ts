import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import type {
  GridColumnVisibility,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridPerson,
  GridSettingsLabels,
  GridSort,
} from '../../shared/grid/types'
import type { DataPriority } from '../../shared/properties/data-priority'
import type { DataOptionAppearance } from '../../shared/properties/types'

export type Team1ColumnId =
  | 'activity'
  | 'joined'
  | 'lastSeen'
  | 'location'
  | 'member'
  | 'priority'
  | 'rating'
  | 'role'
  | 'team'

export type Team1ToggleColumnId = Exclude<Team1ColumnId, 'member'>

export type Team1SortKey = 'joined' | 'lastSeen' | 'member' | 'rating' | 'role'

export type Team1Presence = 'away' | 'offline' | 'online'

export type Team1Density = NonNullable<
  UseDataGridOptions<Team1Member>['density']
>

export type Team1Person = GridPerson

export type Team1Priority = DataPriority

export interface Team1Role {
  label: string
  tone?: DataOptionAppearance['tone']
}

export interface Team1Team {
  members: Team1Person[]
  name: string
}

export interface Team1Member {
  activity: number
  email: string
  id: string
  imageUrl?: string
  isCurrentUser?: boolean
  joined: string
  lastSeen: string
  location: string
  name: string
  presence: Team1Presence
  priority: Team1Priority
  rating: number
  role: Team1Role
  team: Team1Team
}

export type Team1Sort = GridSort<Team1SortKey>

export type Team1ColumnVisibility = GridColumnVisibility<Team1ToggleColumnId>

export interface Team1Settings {
  columnVisibility: Team1ColumnVisibility
  density: Team1Density
  showPaused: boolean
  sort: Team1Sort | null
}

export interface Team1Labels extends GridLoadLabels, GridSettingsLabels {
  activity: (percent: string) => string
  clearFilters: string
  columns: Record<Team1ColumnId, string>
  density: string
  display: string
  displayedProperties: string
  empty: string
  filterAll: string
  filters: string
  pageSize: string
  pausedMembers: string
  presence: Record<Team1Presence, string>
  priorities: Record<Team1Priority, string>
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

export type Team1LabelsOverride = Partial<
  Omit<Team1Labels, 'columns' | 'densities' | 'presence' | 'priorities'>
> & {
  columns?: Partial<Team1Labels['columns']>
  densities?: Partial<Team1Labels['densities']>
  presence?: Partial<Team1Labels['presence']>
  priorities?: Partial<Team1Labels['priorities']>
}

export interface Team1Props extends GridFormatProps, GridLoadProps {
  className?: string
  columnVisibility?: Team1ColumnVisibility
  density?: Team1Density
  labels?: Team1LabelsOverride
  members: Team1Member[]
  onColumnVisibilityChange?: (visibility: Team1ColumnVisibility) => void
  onDensityChange?: (density: Team1Density) => void
  onSave?: (settings: Team1Settings) => void
  onShowPausedChange?: (showPaused: boolean) => void
  onSortChange?: (sort: Team1Sort | null) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
  showPaused?: boolean
  sort?: Team1Sort | null
}
