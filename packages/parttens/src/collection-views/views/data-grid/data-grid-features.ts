import {
  type Column,
  type ColumnDef,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  type Header,
  metaHelper,
  type RowData,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  type Table,
  tableFeatures,
} from '@tanstack/react-table'
import type {
  DataGridCellValueChange,
  DataGridColumnMeta,
  DataGridDensity,
} from './types'

/** Table meta the grid reads from the instance built by `useDataGrid`. */
export interface DataGridTableMeta {
  dataGridDensity?: DataGridDensity
  dataGridPaginationRowOffset?: number
  onDataGridDensityChange?: (density: DataGridDensity) => void
  onDataGridCellValueChange?: (change: DataGridCellValueChange) => void
}

/**
 * Features, row models and function registries the DataGrid relies on. The
 * full `filterFns`/`sortFns` registries keep the v8 behavior of resolving any
 * built-in by name, including the `auto` sort and filter picks.
 */
export const dataGridFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
  columnMeta: metaHelper<DataGridColumnMeta>(),
  tableMeta: metaHelper<DataGridTableMeta>(),
})

export type DataGridFeatures = typeof dataGridFeatures

/** Table instance consumed by the grid and its toolbar pieces. */
export type DataGridTable<TData extends RowData> = Table<
  DataGridFeatures,
  TData
>

/** Convenience alias for column definitions consumed by the grid. */
export type DataGridColumnDef<TData extends RowData> = ColumnDef<
  DataGridFeatures,
  TData,
  unknown
>

export type DataGridColumn<TData extends RowData> = Column<
  DataGridFeatures,
  TData,
  unknown
>

export type DataGridHeader<TData extends RowData> = Header<
  DataGridFeatures,
  TData,
  unknown
>
