import type {
  DashboardBadgeData,
  DashboardFormatProps,
  DashboardHeaderLabels,
  DashboardHeaderProps,
  DashboardKpi,
  DashboardPagination,
  DashboardTableLabels,
} from '../shared/types'

export type Dashboard3Kpi = DashboardKpi

export type Dashboard3Pagination = DashboardPagination

export interface Dashboard3Member {
  avatarSrc?: string
  coverage: number
  id: string
  name: string
  role: string
  shift: string
  status: DashboardBadgeData
}

export interface Dashboard3QueueItem {
  actionLabel?: string
  description: string
  id: string
  priority?: DashboardBadgeData
  title: string
}

export interface Dashboard3ForecastPoint {
  forecast: number
  label: string
  supply: number
}

export interface Dashboard3ForecastSummaryItem {
  forecast: string
  label: string
  supply: string
}

export interface Dashboard3Labels
  extends DashboardHeaderLabels,
    DashboardTableLabels {
  action: string
  actionFor: (action: string, title: string) => string
  columnCoverage: string
  columnMember: string
  columnRole: string
  columnShift: string
  columnStatus: string
  coverageOf: (name: string) => string
  crewTitle: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  forecastLabel: string
  forecastSeries: string
  forecastSummary: (items: Dashboard3ForecastSummaryItem[]) => string
  forecastTitle: string
  indicators: string
  loading: string
  noCrew: string
  noQueue: string
  queueTitle: string
  retry: string
  supplySeries: string
  title: string
}

export interface Dashboard3Props
  extends DashboardFormatProps,
    DashboardHeaderProps {
  className?: string
  crew: Dashboard3Member[]
  error?: boolean
  forecast: Dashboard3ForecastPoint[]
  kpis?: Dashboard3Kpi[]
  labels?: Partial<Dashboard3Labels>
  onAction?: (id: string) => void
  onPageChange?: (page: number) => void
  onRetry?: () => void
  onSearchChange?: (search: string) => void
  pagination?: Dashboard3Pagination
  pending?: boolean
  queue: Dashboard3QueueItem[]
  search?: string
}
