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

export type DataGridDensity = 'short' | 'medium' | 'tall' | 'extra-tall'

export interface DataGridSelectOption {
  label: string
  value: string
}

export interface DataGridCellValueChange {
  columnId: string
  rowId: string
  value: string
}

export interface DataGridColumnMeta {
  variant?: DataGridCellVariant
  type?: DataGridColumnType
  align?: DataGridAlign
  label?: string
  placeholder?: string
  options?: DataGridSelectOption[]
  editable?: boolean
  badgeVariant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info'
    | 'error'
}
