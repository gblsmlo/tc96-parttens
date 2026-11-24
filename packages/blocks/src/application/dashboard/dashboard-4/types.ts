import type { RenderLink } from '@tc96/ui/render-anchor'
import type {
  DashboardBadgeData,
  DashboardBreadcrumbItem,
  DashboardFilterOption,
  DashboardFormatProps,
  DashboardPagination,
  DashboardRowAction,
  DashboardTableLabels,
  DashboardValueFormat,
} from '../shared/types'

export interface Dashboard4Metric {
  caption?: string
  format?: DashboardValueFormat
  id: string
  label: string
  points: number[]
  value: number
}

export interface Dashboard4Person {
  id: string
  imageUrl?: string
  label: string
}

export interface Dashboard4Module {
  domain: string
  favorite?: boolean
  id: string
  kind: string
  name: string
  owner: Dashboard4Person
  status: DashboardBadgeData
  tasksDone: number
  tasksTotal: number
  window: string
  windowDays: number
}

export type Dashboard4RowAction = DashboardRowAction

export type Dashboard4FilterOption = DashboardFilterOption

export interface Dashboard4Pagination extends DashboardPagination {
  from: number
  to: number
  total: number
}

export type Dashboard4SortKey = 'name' | 'progress' | 'status' | 'window'

export type Dashboard4SortDirection = 'asc' | 'desc'

export interface Dashboard4Sort {
  direction: Dashboard4SortDirection
  key: Dashboard4SortKey
}

export interface Dashboard4Labels extends DashboardTableLabels {
  addModule: string
  breadcrumb: string
  columnActions: string
  columnModule: string
  columnProgress: string
  columnStatus: string
  columnWindow: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  favorite: (module: string) => string
  filter: string
  indicators: string
  invite: string
  loading: string
  modulesTitle: string
  noModules: string
  open: (module: string) => string
  rangeOf: (from: number, to: number, total: number) => string
  ready: (percent: string) => string
  retry: string
  rowActionsFor: (module: string) => string
  sortBy: (column: string) => string
  tasks: (done: number, total: number) => string
  team: string
  title: string
  windowDays: (days: number) => string
}

export interface Dashboard4Props extends DashboardFormatProps {
  breadcrumbs?: DashboardBreadcrumbItem[]
  className?: string
  error?: boolean
  filter?: string
  filterOptions?: Dashboard4FilterOption[]
  labels?: Partial<Dashboard4Labels>
  metrics: Dashboard4Metric[]
  modules: Dashboard4Module[]
  onAddModule?: () => void
  onFavoriteChange?: (moduleId: string, favorite: boolean) => void
  onFilterChange?: (filter: string) => void
  onInvite?: () => void
  onOpen?: (moduleId: string) => void
  onPageChange?: (page: number) => void
  onRetry?: () => void
  onRowAction?: (actionId: string, moduleId: string) => void
  onSearchChange?: (search: string) => void
  onSortChange: (sort: Dashboard4Sort) => void
  pagination?: Dashboard4Pagination
  pending?: boolean
  renderLink?: RenderLink
  rowActions?: Dashboard4RowAction[]
  search?: string
  sort: Dashboard4Sort
  team?: Dashboard4Person[]
}
