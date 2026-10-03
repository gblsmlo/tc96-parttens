import type { RowData } from '@tanstack/react-table'
import { NON_NAVIGABLE_COLUMN_IDS } from './constants'
import type { DataGridColumn } from './data-grid-features'

export function isNavigableColumnId(columnId: string) {
  return !NON_NAVIGABLE_COLUMN_IDS.includes(columnId)
}

export function findFirstNavigableColumnIndex<TData extends RowData>(
  columns: readonly DataGridColumn<TData>[],
) {
  return Math.max(
    0,
    columns.findIndex((column) => isNavigableColumnId(column.id)),
  )
}

export function resolveFillColumnId<TData extends RowData>(
  columns: readonly DataGridColumn<TData>[],
  fillColumn: string | false | undefined,
) {
  if (fillColumn === false) return undefined
  if (fillColumn !== undefined) return fillColumn
  for (let index = columns.length - 1; index >= 0; index -= 1) {
    const column = columns[index]
    if (column && !column.getIsPinned() && isNavigableColumnId(column.id)) {
      return column.id
    }
  }
  return undefined
}

export function indexColumns<TData extends RowData>(
  columns: readonly DataGridColumn<TData>[],
) {
  const indexes = new Map<string, number>()
  columns.forEach((column, index) => {
    indexes.set(column.id, index)
  })
  return indexes
}
