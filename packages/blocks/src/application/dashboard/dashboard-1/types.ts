import type {
  DashboardBadgeData,
  DashboardFormatProps,
  DashboardKpi,
} from '../shared/types'

export type Dashboard1Kpi = DashboardKpi

export interface Dashboard1CapacityPoint {
  capacity: number
  id: string
  label: string
  used: number
}

export interface Dashboard1Exception {
  delayHours: number
  hub: string
  id: string
  order: string
  reason: string
  status: DashboardBadgeData
}

export interface Dashboard1FilterOption {
  label: string
  value: string
}

export interface Dashboard1CapacitySummaryItem {
  capacity: string
  label: string
  used: string
}

export interface Dashboard1Labels {
  capacityLabel: string
  capacitySummary: (items: Dashboard1CapacitySummaryItem[]) => string
  capacityTitle: string
  capacityTotal: string
  capacityUsed: string
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
  retry: string
  title: string
}

export interface Dashboard1Props extends DashboardFormatProps {
  capacity: Dashboard1CapacityPoint[]
  className?: string
  error?: boolean
  exceptions: Dashboard1Exception[]
  filter: string
  filterOptions: Dashboard1FilterOption[]
  kpis: Dashboard1Kpi[]
  labels?: Partial<Dashboard1Labels>
  onFilterChange: (filter: string) => void
  onRetry?: () => void
  pending?: boolean
}
