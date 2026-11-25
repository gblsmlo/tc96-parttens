import type {
  GridColumnVisibility,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridSort,
} from '../../shared/grid/types'

export type Finance1Status = 'failed' | 'pending' | 'refunded' | 'settled'

export type Finance1Method = 'apple-pay' | 'card' | 'google-pay' | 'paypal'

export type Finance1Channel = 'api' | 'mobile' | 'pos' | 'web'

export type Finance1RiskBand = 'high' | 'low' | 'medium'

export type Finance1Density =
  | 'compact'
  | 'extra-tall'
  | 'medium'
  | 'short'
  | 'tall'

export type Finance1ToggleColumnId =
  | 'amount'
  | 'channel'
  | 'customer'
  | 'date'
  | 'method'
  | 'risk'
  | 'status'

export type Finance1ColumnId = Finance1ToggleColumnId | 'select' | 'transaction'

export type Finance1SortKey =
  | 'amount'
  | 'customer'
  | 'date'
  | 'risk'
  | 'status'
  | 'transaction'

export interface Finance1Customer {
  email: string
  imageUrl?: string
  name: string
}

export interface Finance1Transaction {
  amount: number
  channel: Finance1Channel
  chargeId: string
  createdAt: string
  customer: Finance1Customer
  id: string
  lastFour: string
  method: Finance1Method
  risk: number
  status: Finance1Status
}

export interface Finance1Filters {
  channel: Finance1Channel | ''
  method: Finance1Method | ''
  status: Finance1Status | ''
}

export interface Finance1View {
  id: string
  label: string
}

export type Finance1Sort = GridSort<Finance1SortKey>

export type Finance1ColumnVisibility =
  GridColumnVisibility<Finance1ToggleColumnId>

export interface Finance1Labels extends GridLoadLabels {
  allOptions: string
  channels: Record<Finance1Channel, string>
  clearFilters: string
  clearSelection: string
  columns: Record<Finance1ColumnId, string>
  columnsMenu: string
  createView: string
  density: string
  display: string
  empty: string
  export: string
  exportSelected: string
  filters: string
  flag: string
  loaded: (loaded: string, total: string) => string
  methodEnding: (method: string, lastFour: string) => string
  methods: Record<Finance1Method, string>
  refresh: string
  refund: string
  risk: (band: string, score: string) => string
  riskBands: Record<Finance1RiskBand, string>
  search: string
  searchViews: string
  selectAll: string
  selected: (count: number, amount: string) => string
  selectionActions: string
  selectRow: (transactionId: string) => string
  sortBy: string
  statuses: Record<Finance1Status, string>
  title: string
  toolbar: string
  viewSettings: string
  views: string
}

export type Finance1LabelsOverride = Partial<
  Omit<
    Finance1Labels,
    'channels' | 'columns' | 'methods' | 'riskBands' | 'statuses'
  >
> & {
  channels?: Partial<Finance1Labels['channels']>
  columns?: Partial<Finance1Labels['columns']>
  methods?: Partial<Finance1Labels['methods']>
  riskBands?: Partial<Finance1Labels['riskBands']>
  statuses?: Partial<Finance1Labels['statuses']>
}

export interface Finance1Props extends GridFormatProps, GridLoadProps {
  activeViewId?: string
  className?: string
  columnVisibility?: Finance1ColumnVisibility
  density?: Finance1Density
  filters?: Finance1Filters
  hasMore?: boolean
  labels?: Finance1LabelsOverride
  loadedCount?: number
  loadingMore?: boolean
  maxHeight?: number
  onColumnVisibilityChange?: (visibility: Finance1ColumnVisibility) => void
  onDensityChange?: (density: Finance1Density) => void
  onExport?: () => void
  onExportSelected?: (transactionIds: string[]) => void
  onFiltersChange?: (filters: Finance1Filters) => void
  onFlag?: (transactionIds: string[]) => void
  onLoadMore?: () => void
  onRefresh?: () => void
  onRefund?: (transactionIds: string[]) => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (transactionIds: string[]) => void
  onSortChange?: (sort: Finance1Sort | null) => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  refreshing?: boolean
  search?: string
  selectedIds?: string[]
  sort?: Finance1Sort | null
  totalCount: number
  transactions: Finance1Transaction[]
  views?: Finance1View[]
}
