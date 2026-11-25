import type {
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
} from '../../shared/grid/types'

export type Inventory1Status = 'active' | 'archived' | 'draft'

export type Inventory1EditableField = 'price' | 'stock'

export type Inventory1ColumnId =
  | 'actions'
  | 'category'
  | 'price'
  | 'product'
  | 'status'
  | 'stock'
  | 'visible'

export interface Inventory1Product {
  category: string
  id: string
  name: string
  price: number
  sku: string
  status: Inventory1Status
  stock: number
  visible: boolean
}

export type Inventory1Draft = Partial<Record<Inventory1EditableField, number>>

export type Inventory1Drafts = Record<string, Inventory1Draft>

export type Inventory1CellErrors = Record<
  string,
  Partial<Record<Inventory1EditableField, string>>
>

export interface Inventory1RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Inventory1Labels extends GridLoadLabels {
  addProduct: string
  allSaved: string
  allStatuses: string
  cellLabel: (column: string, value: string) => string
  changed: string
  clearFilters: string
  columns: Record<Inventory1ColumnId, string>
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
  statuses: Record<Inventory1Status, string>
  stockNegative: string
  stockNotInteger: string
  title: string
  toolbar: string
  unsavedChanges: (count: number) => string
  view: string
  viewWithFilters: (view: string, count: number) => string
  visibleFor: (product: string) => string
}

export type Inventory1LabelsOverride = Partial<
  Omit<Inventory1Labels, 'columns' | 'statuses'>
> & {
  columns?: Partial<Inventory1Labels['columns']>
  statuses?: Partial<Inventory1Labels['statuses']>
}

export interface Inventory1Props extends GridFormatProps, GridLoadProps {
  cellErrors?: Inventory1CellErrors
  className?: string
  drafts?: Inventory1Drafts
  labels?: Inventory1LabelsOverride
  lowStockThreshold?: number
  onAdd?: () => void
  onDiscard?: () => void
  onDraftsChange?: (drafts: Inventory1Drafts) => void
  onRowAction?: (actionId: string, productId: string) => void
  onSave?: (drafts: Inventory1Drafts) => void
  onVisibleChange?: (productId: string, visible: boolean) => void
  pageSize?: number
  products: Inventory1Product[]
  rowActions?: Inventory1RowAction[]
  saving?: boolean
}
