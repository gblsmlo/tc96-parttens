import { createContext, useContext } from 'react'
import type { ColumnLayouts } from '../lib/column-layout'
import type { DataGridTableMeta } from '../lib/data-grid-features'
import type { DataGridDensity } from '../types'
import type { CellInteractions } from './use-data-grid-cell-events'

export type DataGridRowSelectionOption =
  | boolean
  | ((row: never) => boolean)
  | undefined

export interface DataGridRowContextValue {
  columnLayouts: ColumnLayouts
  columns: readonly { readonly id: string }[]
  enableRowSelection: DataGridRowSelectionOption
  meta: DataGridTableMeta | undefined
  density: DataGridDensity
  interactions: CellInteractions
  rowSelectable: boolean
}

export const DataGridRowContext = createContext<DataGridRowContextValue | null>(
  null,
)

export function useDataGridRowContext() {
  const value = useContext(DataGridRowContext)
  if (!value) throw new Error('DataGridRow must render inside DataGrid')
  return value
}
