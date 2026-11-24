import type {
  DashboardBadgeData,
  DashboardFilterOption,
  DashboardFormatProps,
  DashboardHeaderLabels,
  DashboardHeaderProps,
  DashboardKpi,
  DashboardPagination,
  DashboardRowAction,
  DashboardTableLabels,
} from '../shared/types'

export type Dashboard1Kpi = DashboardKpi

export interface Dashboard1CapacityPoint {
  capacity: number
  id: string
  label: string
  used: number
}

export interface Dashboard1ReasonSlice {
  id: string
  label: string
  value: number
}

export interface Dashboard1Exception {
  delayHours: number
  hub: string
  id: string
  order: string
  reason: string
  status: DashboardBadgeData
}

export type Dashboard1FilterOption = DashboardFilterOption

export type Dashboard1RowAction = DashboardRowAction

export type Dashboard1Pagination = DashboardPagination

export interface Dashboard1CapacitySummaryItem {
  capacity: string
  label: string
  used: string
}

export interface Dashboard1ReasonSummaryItem {
  label: string
  value: string
}

export interface Dashboard1Labels
  extends DashboardHeaderLabels,
    DashboardTableLabels {
  capacityLabel: string
  capacitySummary: (items: Dashboard1CapacitySummaryItem[]) => string
  capacityTitle: string
  capacityTotal: string
  capacityUsed: string
  columnActions: string
  columnDelay: string
  columnHub: string
  columnOrder: string
  columnReason: string
  columnStatus: string
  delay: (hours: string) => string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  exceptionsTitle: string
  filter: string
  indicators: string
  loading: string
  noExceptions: string
  reasonsLabel: string
  reasonsSummary: (items: Dashboard1ReasonSummaryItem[]) => string
  reasonsTitle: string
  retry: string
  rowActionsFor: (order: string) => string
}

export interface Dashboard1Props
  extends DashboardFormatProps,
    DashboardHeaderProps {
  capacity: Dashboard1CapacityPoint[]
  className?: string
  error?: boolean
  exceptions: Dashboard1Exception[]
  filter: string
  filterOptions: Dashboard1FilterOption[]
  kpis: Dashboard1Kpi[]
  labels?: Partial<Dashboard1Labels>
  onFilterChange: (filter: string) => void
  onPageChange?: (page: number) => void
  onRetry?: () => void
  onRowAction?: (actionId: string, exceptionId: string) => void
  onSearchChange?: (search: string) => void
  pagination?: Dashboard1Pagination
  pending?: boolean
  reasons?: Dashboard1ReasonSlice[]
  rowActions?: Dashboard1RowAction[]
  search?: string
}
