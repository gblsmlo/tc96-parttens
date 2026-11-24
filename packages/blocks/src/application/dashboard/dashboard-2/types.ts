import type {
  DashboardBadgeData,
  DashboardFormatProps,
  DashboardHeaderLabels,
  DashboardHeaderProps,
  DashboardKpi,
  DashboardPagination,
  DashboardRowAction,
  DashboardTableLabels,
} from '../shared/types'

export type Dashboard2Kpi = DashboardKpi

export interface Dashboard2Channel {
  id: string
  label: string
}

export interface Dashboard2SalesPoint {
  label: string
  plan?: number
  values: Record<string, number>
}

export type Dashboard2RowAction = DashboardRowAction

export type Dashboard2Pagination = DashboardPagination

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

export interface Dashboard2MixSummaryItem {
  label: string
  total: string
}

export interface Dashboard2Labels
  extends DashboardHeaderLabels,
    DashboardTableLabels {
  columnActions: string
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
  mixLabel: string
  mixSummary: (items: Dashboard2MixSummaryItem[]) => string
  mixTitle: string
  noOrders: string
  ordersTitle: string
  planSeries: string
  retry: string
  rowActionsFor: (order: string) => string
  salesLabel: string
  salesSummary: (items: Dashboard2SalesSummaryItem[]) => string
  salesTitle: string
  sortBy: (column: string) => string
  title: string
}

export interface Dashboard2Props
  extends DashboardFormatProps,
    DashboardHeaderProps {
  channels: Dashboard2Channel[]
  className?: string
  error?: boolean
  kpis: Dashboard2Kpi[]
  labels?: Partial<Dashboard2Labels>
  onPageChange?: (page: number) => void
  onRetry?: () => void
  onRowAction?: (actionId: string, orderId: string) => void
  onSearchChange?: (search: string) => void
  onSortChange: (sort: Dashboard2Sort) => void
  orders: Dashboard2Order[]
  pagination?: Dashboard2Pagination
  pending?: boolean
  rowActions?: Dashboard2RowAction[]
  sales: Dashboard2SalesPoint[]
  search?: string
  sort: Dashboard2Sort
}
