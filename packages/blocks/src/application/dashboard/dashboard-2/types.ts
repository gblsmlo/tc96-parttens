import type {
  DashboardBadgeData,
  DashboardFormatProps,
  DashboardKpi,
} from '../shared/types'

export type Dashboard2Kpi = DashboardKpi

export interface Dashboard2Channel {
  id: string
  label: string
}

export interface Dashboard2SalesPoint {
  label: string
  values: Record<string, number>
}

export interface Dashboard2Order {
  customer: string
  id: string
  number: string
  placedAt: string
  status: DashboardBadgeData
  total: number
}

export type Dashboard2SortKey = 'customer' | 'placedAt' | 'total'

export type Dashboard2SortDirection = 'asc' | 'desc'

export interface Dashboard2Sort {
  direction: Dashboard2SortDirection
  key: Dashboard2SortKey
}

export interface Dashboard2SalesSummaryItem {
  label: string
  total: string
}

export interface Dashboard2Labels {
  columnCustomer: string
  columnOrder: string
  columnPlacedAt: string
  columnStatus: string
  columnTotal: string
  emptyDescription: string
  emptyTitle: string
  errorDescription: string
  errorTitle: string
  indicators: string
  loading: string
  noOrders: string
  ordersTitle: string
  retry: string
  salesLabel: string
  salesSummary: (items: Dashboard2SalesSummaryItem[]) => string
  salesTitle: string
  sortBy: (column: string) => string
  title: string
}

export interface Dashboard2Props extends DashboardFormatProps {
  channels: Dashboard2Channel[]
  className?: string
  error?: boolean
  kpis: Dashboard2Kpi[]
  labels?: Partial<Dashboard2Labels>
  onRetry?: () => void
  onSortChange: (sort: Dashboard2Sort) => void
  orders: Dashboard2Order[]
  pending?: boolean
  sales: Dashboard2SalesPoint[]
  sort: Dashboard2Sort
}
