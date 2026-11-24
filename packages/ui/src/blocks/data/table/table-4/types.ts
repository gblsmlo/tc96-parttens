import type {
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
} from '../shared/types'

export type Table4Status = 'active' | 'archived' | 'draft'

export type Table4EditableField = 'price' | 'stock'

export type Table4ColumnId =
  | 'actions'
  | 'category'
  | 'price'
  | 'product'
  | 'status'
  | 'stock'
  | 'visible'

export interface Table4Product {
  category: string
  id: string
  name: string
  price: number
  sku: string
  status: Table4Status
  stock: number
  visible: boolean
}

export type Table4Draft = Partial<Record<Table4EditableField, number>>

export type Table4Drafts = Record<string, Table4Draft>

export type Table4CellErrors = Record<
  string,
  Partial<Record<Table4EditableField, string>>
>

export interface Table4RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Table4Labels extends TableLoadLabels {
  addProduct: string
  allSaved: string
  allStatuses: string
  cellLabel: (column: string, value: string) => string
  changed: string
  clearFilters: string
  columns: Record<Table4ColumnId, string>
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
  statuses: Record<Table4Status, string>
  stockNegative: string
  stockNotInteger: string
  title: string
  toolbar: string
  unsavedChanges: (count: number) => string
  view: string
  viewWithFilters: (view: string, count: number) => string
  visibleFor: (product: string) => string
}

export type Table4LabelsOverride = Partial<
  Omit<Table4Labels, 'columns' | 'statuses'>
> & {
  columns?: Partial<Table4Labels['columns']>
  statuses?: Partial<Table4Labels['statuses']>
}

export interface Table4Props extends TableFormatProps, TableLoadProps {
  cellErrors?: Table4CellErrors
  className?: string
  drafts?: Table4Drafts
  labels?: Table4LabelsOverride
  lowStockThreshold?: number
  onAdd?: () => void
  onDiscard?: () => void
  onDraftsChange?: (drafts: Table4Drafts) => void
  onRowAction?: (actionId: string, productId: string) => void
  onSave?: (drafts: Table4Drafts) => void
  onVisibleChange?: (productId: string, visible: boolean) => void
  pageSize?: number
  products: Table4Product[]
  rowActions?: Table4RowAction[]
  saving?: boolean
}
