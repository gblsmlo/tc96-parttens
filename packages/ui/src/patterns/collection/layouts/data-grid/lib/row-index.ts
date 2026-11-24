import type { Row, RowData } from '@tanstack/react-table'
import type { DataGridFeatures } from './data-grid-features'

export function indexRowPositions<TData extends RowData>(
  rows: readonly Row<DataGridFeatures, TData>[],
) {
  const positions = new Map<string, number>()
  rows.forEach((row, position) => {
    positions.set(row.id, position)
  })
  return positions
}

interface CollectionRowIndexInput<TData extends RowData> {
  fallbackIndex: number
  paginationRowOffset: number
  positions: ReadonlyMap<string, number>
  row: Row<DataGridFeatures, TData>
}

export function resolveCollectionRowIndex<TData extends RowData>({
  fallbackIndex,
  paginationRowOffset,
  positions,
  row,
}: CollectionRowIndexInput<TData>) {
  if (paginationRowOffset > 0) return paginationRowOffset + fallbackIndex
  return positions.get(row.id) ?? row.index ?? fallbackIndex
}
