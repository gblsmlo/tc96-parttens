import {
  type Column,
  type ColumnDef,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  type Header,
  metaHelper,
  type RowData,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  type Table,
  tableFeatures,
} from '@tanstack/react-table'
import type {
  CollectionDensity,
  DataGridCellValueChange,
  DataGridColumnMeta,
} from '../types'

export interface DataGridTableMeta {
  dataGridDensity?: CollectionDensity
  dataGridPaginationRowOffset?: number
  onDataGridDensityChange?: (density: CollectionDensity) => void
  onDataGridCellValueChange?: (change: DataGridCellValueChange) => void
}

export const dataGridFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
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
