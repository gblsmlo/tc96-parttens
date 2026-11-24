import type {
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
} from '../shared/types'

export type DataGrid4Status = 'active' | 'archived' | 'draft'

export type DataGrid4EditableField = 'price' | 'stock'

export type DataGrid4ColumnId =
  | 'actions'
  | 'category'
  | 'price'
  | 'product'
  | 'status'
  | 'stock'
  | 'visible'

export interface DataGrid4Product {
  category: string
  id: string
  name: string
  price: number
  sku: string
  status: DataGrid4Status
  stock: number
  visible: boolean
}

export type DataGrid4Draft = Partial<Record<DataGrid4EditableField, number>>

export type DataGrid4Drafts = Record<string, DataGrid4Draft>

export type DataGrid4CellErrors = Record<
  string,
  Partial<Record<DataGrid4EditableField, string>>
>

export interface DataGrid4RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface DataGrid4Labels extends GridLoadLabels {
  addProduct: string
  allSaved: string
  allStatuses: string
  cellLabel: (column: string, value: string) => string
  changed: string
  clearFilters: string
  columns: Record<DataGrid4ColumnId, string>
  description: string
  discard: string
  empty: string
  emptyValue: string
  filters: string
  lowStock: string
  priceInvalid: string
  priceNegative: string
  rowActionsFor: (product: string) => string
  save: string
  search: string
  statusFilter: string
  statuses: Record<DataGrid4Status, string>
  stockNegative: string
  stockNotInteger: string
  title: string
  toolbar: string
  unsavedChanges: (count: number) => string
  view: string
  viewWithFilters: (view: string, count: number) => string
  visibleFor: (product: string) => string
}

export type DataGrid4LabelsOverride = Partial<
  Omit<DataGrid4Labels, 'columns' | 'statuses'>
> & {
  columns?: Partial<DataGrid4Labels['columns']>
  statuses?: Partial<DataGrid4Labels['statuses']>
}

export interface DataGrid4Props extends GridFormatProps, GridLoadProps {
  cellErrors?: DataGrid4CellErrors
  className?: string
  drafts?: DataGrid4Drafts
  labels?: DataGrid4LabelsOverride
  lowStockThreshold?: number
  onAdd?: () => void
  onDiscard?: () => void
  onDraftsChange?: (drafts: DataGrid4Drafts) => void
  onRowAction?: (actionId: string, productId: string) => void
  onSave?: (drafts: DataGrid4Drafts) => void
  onVisibleChange?: (productId: string, visible: boolean) => void
  pageSize?: number
  products: DataGrid4Product[]
  rowActions?: DataGrid4RowAction[]
  saving?: boolean
}
