import type {
  TableColumnVisibility,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TableSort,
} from '../shared/types'

export type Table8Status = 'failed' | 'pending' | 'refunded' | 'settled'

export type Table8Method = 'apple-pay' | 'card' | 'google-pay' | 'paypal'

export type Table8Channel = 'api' | 'mobile' | 'pos' | 'web'

export type Table8RiskBand = 'high' | 'low' | 'medium'

export type Table8Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type Table8ToggleColumnId =
  | 'amount'
  | 'channel'
  | 'customer'
  | 'date'
  | 'method'
  | 'risk'
  | 'status'

export type Table8ColumnId = Table8ToggleColumnId | 'select' | 'transaction'

export type Table8SortKey =
  | 'amount'
  | 'customer'
  | 'date'
  | 'risk'
  | 'status'
  | 'transaction'

export interface Table8Customer {
  email: string
  imageUrl?: string
  name: string
}

export interface Table8Transaction {
  amount: number
  channel: Table8Channel
  chargeId: string
  createdAt: string
  customer: Table8Customer
  id: string
  lastFour: string
  method: Table8Method
  risk: number
  status: Table8Status
}

export interface Table8Filters {
  channel: Table8Channel | ''
  method: Table8Method | ''
  status: Table8Status | ''
}

export interface Table8View {
  id: string
  label: string
}

export type Table8Sort = TableSort<Table8SortKey>

export type Table8ColumnVisibility = TableColumnVisibility<Table8ToggleColumnId>

export interface Table8Labels extends TableLoadLabels {
  allOptions: string
  channels: Record<Table8Channel, string>
  clearFilters: string
  clearSelection: string
  columns: Record<Table8ColumnId, string>
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
  methods: Record<Table8Method, string>
  refresh: string
  refund: string
  risk: (band: string, score: string) => string
  riskBands: Record<Table8RiskBand, string>
  search: string
  searchViews: string
  selectAll: string
  selected: (count: number, amount: string) => string
  selectionActions: string
  selectRow: (transactionId: string) => string
  sortBy: string
  statuses: Record<Table8Status, string>
  title: string
  toolbar: string
  viewSettings: string
  views: string
}

export type Table8LabelsOverride = Partial<
  Omit<
    Table8Labels,
    'channels' | 'columns' | 'methods' | 'riskBands' | 'statuses'
  >
> & {
  channels?: Partial<Table8Labels['channels']>
  columns?: Partial<Table8Labels['columns']>
  methods?: Partial<Table8Labels['methods']>
  riskBands?: Partial<Table8Labels['riskBands']>
  statuses?: Partial<Table8Labels['statuses']>
}

export interface Table8Props extends TableFormatProps, TableLoadProps {
  activeViewId?: string
  className?: string
  columnVisibility?: Table8ColumnVisibility
  density?: Table8Density
  filters?: Table8Filters
  hasMore?: boolean
  labels?: Table8LabelsOverride
  loadedCount?: number
  loadingMore?: boolean
  maxHeight?: number
  onColumnVisibilityChange?: (visibility: Table8ColumnVisibility) => void
  onDensityChange?: (density: Table8Density) => void
  onExport?: () => void
  onExportSelected?: (transactionIds: string[]) => void
  onFiltersChange?: (filters: Table8Filters) => void
  onFlag?: (transactionIds: string[]) => void
  onLoadMore?: () => void
  onRefresh?: () => void
  onRefund?: (transactionIds: string[]) => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (transactionIds: string[]) => void
  onSortChange?: (sort: Table8Sort | null) => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  refreshing?: boolean
  search?: string
  selectedIds?: string[]
  sort?: Table8Sort | null
  totalCount: number
  transactions: Table8Transaction[]
  views?: Table8View[]
}
