import type {
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
} from '../../shared/table/types'

export type Inventory2Status = 'active' | 'archived' | 'draft'

export type Inventory2EditableField = 'price' | 'stock'

export type Inventory2ColumnId =
  | 'actions'
  | 'category'
  | 'price'
  | 'product'
  | 'status'
  | 'stock'
  | 'visible'

export interface Inventory2Product {
  category: string
  id: string
  name: string
  price: number
  sku: string
  status: Inventory2Status
  stock: number
  visible: boolean
}

export type Inventory2Draft = Partial<Record<Inventory2EditableField, number>>

export type Inventory2Drafts = Record<string, Inventory2Draft>

export type Inventory2CellErrors = Record<
  string,
  Partial<Record<Inventory2EditableField, string>>
>

export interface Inventory2RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Inventory2Labels extends TableLoadLabels {
  addProduct: string
  allSaved: string
  allStatuses: string
  cellLabel: (column: string, value: string) => string
  changed: string
  clearFilters: string
  columns: Record<Inventory2ColumnId, string>
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
  statuses: Record<Inventory2Status, string>
  stockNegative: string
  stockNotInteger: string
  title: string
  toolbar: string
  unsavedChanges: (count: number) => string
  view: string
  viewWithFilters: (view: string, count: number) => string
  visibleFor: (product: string) => string
}

export type Inventory2LabelsOverride = Partial<
  Omit<Inventory2Labels, 'columns' | 'statuses'>
> & {
  columns?: Partial<Inventory2Labels['columns']>
  statuses?: Partial<Inventory2Labels['statuses']>
}

export interface Inventory2Props extends TableFormatProps, TableLoadProps {
  cellErrors?: Inventory2CellErrors
  className?: string
  drafts?: Inventory2Drafts
  labels?: Inventory2LabelsOverride
  lowStockThreshold?: number
  onAdd?: () => void
  onDiscard?: () => void
  onDraftsChange?: (drafts: Inventory2Drafts) => void
  onRowAction?: (actionId: string, productId: string) => void
  onSave?: (drafts: Inventory2Drafts) => void
  onVisibleChange?: (productId: string, visible: boolean) => void
  pageSize?: number
  products: Inventory2Product[]
  rowActions?: Inventory2RowAction[]
  saving?: boolean
}
