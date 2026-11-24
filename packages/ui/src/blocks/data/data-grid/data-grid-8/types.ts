import type {
  GridColumnVisibility,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridSort,
} from '../shared/types'

export type DataGrid8Status = 'failed' | 'pending' | 'refunded' | 'settled'

export type DataGrid8Method = 'apple-pay' | 'card' | 'google-pay' | 'paypal'

export type DataGrid8Channel = 'api' | 'mobile' | 'pos' | 'web'

export type DataGrid8RiskBand = 'high' | 'low' | 'medium'

export type DataGrid8Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type DataGrid8ToggleColumnId =
  | 'amount'
  | 'channel'
  | 'customer'
  | 'date'
  | 'method'
  | 'risk'
  | 'status'

export type DataGrid8ColumnId =
  | DataGrid8ToggleColumnId
  | 'select'
  | 'transaction'

export type DataGrid8SortKey =
  | 'amount'
  | 'customer'
  | 'date'
  | 'risk'
  | 'status'
  | 'transaction'

export interface DataGrid8Customer {
  email: string
  imageUrl?: string
  name: string
}

export interface DataGrid8Transaction {
  amount: number
  channel: DataGrid8Channel
  chargeId: string
  createdAt: string
  customer: DataGrid8Customer
  id: string
  lastFour: string
  method: DataGrid8Method
  risk: number
  status: DataGrid8Status
}

export interface DataGrid8Filters {
  channel: DataGrid8Channel | ''
  method: DataGrid8Method | ''
  status: DataGrid8Status | ''
}

export interface DataGrid8View {
  id: string
  label: string
}

export type DataGrid8Sort = GridSort<DataGrid8SortKey>

export type DataGrid8ColumnVisibility =
  GridColumnVisibility<DataGrid8ToggleColumnId>

export interface DataGrid8Labels extends GridLoadLabels {
  allOptions: string
  channels: Record<DataGrid8Channel, string>
  clearFilters: string
  clearSelection: string
  columns: Record<DataGrid8ColumnId, string>
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
  methods: Record<DataGrid8Method, string>
  refresh: string
  refund: string
  risk: (band: string, score: string) => string
  riskBands: Record<DataGrid8RiskBand, string>
  search: string
  searchViews: string
  selectAll: string
  selected: (count: number, amount: string) => string
  selectionActions: string
  selectRow: (transactionId: string) => string
  sortBy: string
  statuses: Record<DataGrid8Status, string>
  title: string
  toolbar: string
  viewSettings: string
  views: string
}

export type DataGrid8LabelsOverride = Partial<
  Omit<
    DataGrid8Labels,
    'channels' | 'columns' | 'methods' | 'riskBands' | 'statuses'
  >
> & {
  channels?: Partial<DataGrid8Labels['channels']>
  columns?: Partial<DataGrid8Labels['columns']>
  methods?: Partial<DataGrid8Labels['methods']>
  riskBands?: Partial<DataGrid8Labels['riskBands']>
  statuses?: Partial<DataGrid8Labels['statuses']>
}

export interface DataGrid8Props extends GridFormatProps, GridLoadProps {
  activeViewId?: string
  className?: string
  columnVisibility?: DataGrid8ColumnVisibility
  density?: DataGrid8Density
  filters?: DataGrid8Filters
  hasMore?: boolean
  labels?: DataGrid8LabelsOverride
  loadedCount?: number
  loadingMore?: boolean
  maxHeight?: number
  onColumnVisibilityChange?: (visibility: DataGrid8ColumnVisibility) => void
  onDensityChange?: (density: DataGrid8Density) => void
  onExport?: () => void
  onExportSelected?: (transactionIds: string[]) => void
  onFiltersChange?: (filters: DataGrid8Filters) => void
  onFlag?: (transactionIds: string[]) => void
  onLoadMore?: () => void
  onRefresh?: () => void
  onRefund?: (transactionIds: string[]) => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (transactionIds: string[]) => void
  onSortChange?: (sort: DataGrid8Sort | null) => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  refreshing?: boolean
  search?: string
  selectedIds?: string[]
  sort?: DataGrid8Sort | null
  totalCount: number
  transactions: DataGrid8Transaction[]
  views?: DataGrid8View[]
}
