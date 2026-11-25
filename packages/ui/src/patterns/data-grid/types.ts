import type {
  RowDragAnnouncements,
  RowMove,
} from '../collection/shared/lib/row-reorder'

export type DataGridCellVariant =
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'badge'
  | 'custom'

export const DATA_GRID_COLUMN_TYPES = [
  'title',
  'text',
  'number',
  'select',
  'multi-select',
  'status',
  'date',
  'formula',
  'relation',
  'rollup',
  'person',
  'file',
  'checkbox',
  'url',
  'email',
  'phone',
  'created-time',
  'created-by',
  'last-edited-time',
  'last-edited-by',
  'button',
  'id',
  'place',
] as const

export type DataGridColumnType = (typeof DATA_GRID_COLUMN_TYPES)[number]

export type DataGridAlign = 'start' | 'center' | 'end'

export type { CollectionDensity } from '../collection/types/collection'

export interface DataGridSelectOption {
  label: string
  value: string
}

export interface DataGridCellValueChange {
  columnId: string
  rowId: string
  value: string
}

export interface DataGridCellRow {
  readonly id: string
  readonly index: number
  readonly original: unknown
}

export type DataGridRowMove = RowMove

export type DataGridRowDragAnnouncements = RowDragAnnouncements

export interface DataGridColumnMeta {
  variant?: DataGridCellVariant
  type?: DataGridColumnType
  align?: DataGridAlign
  label?: string
  placeholder?: string
  options?: DataGridSelectOption[]
  editable?: boolean
  getCellError?: (row: DataGridCellRow, columnId: string) => string | undefined
  validate?: (value: string, row: DataGridCellRow) => string | undefined
  formatValue?: (value: string) => string
  emptyLabel?: string
  getCellLabel?: (columnLabel: string, displayValue: string) => string
  badgeVariant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info'
    | 'error'
}
