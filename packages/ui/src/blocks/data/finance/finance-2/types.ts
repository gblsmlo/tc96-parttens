import type {
  TableColumnVisibility,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TableSort,
} from '../../shared/table/types'

export type Finance2Status = 'failed' | 'pending' | 'refunded' | 'settled'

export type Finance2Method = 'apple-pay' | 'card' | 'google-pay' | 'paypal'

export type Finance2Channel = 'api' | 'mobile' | 'pos' | 'web'

export type Finance2RiskBand = 'high' | 'low' | 'medium'

export type Finance2Density =
  | 'compact'
  | 'extra-tall'
  | 'medium'
  | 'short'
  | 'tall'

export type Finance2ToggleColumnId =
  | 'amount'
  | 'channel'
  | 'customer'
  | 'date'
  | 'method'
  | 'risk'
  | 'status'

export type Finance2ColumnId = Finance2ToggleColumnId | 'select' | 'transaction'

export type Finance2SortKey =
  | 'amount'
  | 'customer'
  | 'date'
  | 'risk'
  | 'status'
  | 'transaction'

export interface Finance2Customer {
  email: string
  imageUrl?: string
  name: string
}

export interface Finance2Transaction {
  amount: number
  channel: Finance2Channel
  chargeId: string
  createdAt: string
  customer: Finance2Customer
  id: string
  lastFour: string
  method: Finance2Method
  risk: number
  status: Finance2Status
}

export interface Finance2Filters {
  channel: Finance2Channel | ''
  method: Finance2Method | ''
  status: Finance2Status | ''
}

export interface Finance2View {
  id: string
  label: string
}

export type Finance2Sort = TableSort<Finance2SortKey>

export type Finance2ColumnVisibility =
  TableColumnVisibility<Finance2ToggleColumnId>

export interface Finance2Labels extends TableLoadLabels {
  allOptions: string
  channels: Record<Finance2Channel, string>
  clearFilters: string
  clearSelection: string
  columns: Record<Finance2ColumnId, string>
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
  methods: Record<Finance2Method, string>
  refresh: string
  refund: string
  risk: (band: string, score: string) => string
  riskBands: Record<Finance2RiskBand, string>
  search: string
  searchViews: string
  selectAll: string
  selected: (count: number, amount: string) => string
  selectionActions: string
  selectRow: (transactionId: string) => string
  sortBy: string
  statuses: Record<Finance2Status, string>
  title: string
  toolbar: string
  viewSettings: string
  views: string
}

export type Finance2LabelsOverride = Partial<
  Omit<
    Finance2Labels,
    'channels' | 'columns' | 'methods' | 'riskBands' | 'statuses'
  >
> & {
  channels?: Partial<Finance2Labels['channels']>
  columns?: Partial<Finance2Labels['columns']>
  methods?: Partial<Finance2Labels['methods']>
  riskBands?: Partial<Finance2Labels['riskBands']>
  statuses?: Partial<Finance2Labels['statuses']>
}

export interface Finance2Props extends TableFormatProps, TableLoadProps {
  activeViewId?: string
  className?: string
  columnVisibility?: Finance2ColumnVisibility
  density?: Finance2Density
  filters?: Finance2Filters
  hasMore?: boolean
  labels?: Finance2LabelsOverride
  loadedCount?: number
  loadingMore?: boolean
  maxHeight?: number
  onColumnVisibilityChange?: (visibility: Finance2ColumnVisibility) => void
  onDensityChange?: (density: Finance2Density) => void
  onExport?: () => void
  onExportSelected?: (transactionIds: string[]) => void
  onFiltersChange?: (filters: Finance2Filters) => void
  onFlag?: (transactionIds: string[]) => void
  onLoadMore?: () => void
  onRefresh?: () => void
  onRefund?: (transactionIds: string[]) => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (transactionIds: string[]) => void
  onSortChange?: (sort: Finance2Sort | null) => void
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  refreshing?: boolean
  search?: string
  selectedIds?: string[]
  sort?: Finance2Sort | null
  totalCount: number
  transactions: Finance2Transaction[]
  views?: Finance2View[]
}
