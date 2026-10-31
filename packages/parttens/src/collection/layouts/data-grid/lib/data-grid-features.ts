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
} from '../types'

export interface DataGridTableMeta {
  dataGridDensity?: DataGridDensity
  dataGridPaginationRowOffset?: number
  onDataGridDensityChange?: (density: DataGridDensity) => void
  onDataGridCellValueChange?: (change: DataGridCellValueChange) => void
}

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

export type DataGridTable<TData extends RowData> = Table<
  DataGridFeatures,
  TData
>

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
