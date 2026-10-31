'use client'

import {
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ColumnVisibilityState,
  type PaginationState,
  type ReactTable,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  useTable,
} from '@tanstack/react-table'
import { createElement, useMemo, useState } from 'react'
import { DataGridCell } from '../components/data-grid-cell'
import {
  type DataGridColumnDef,
  type DataGridFeatures,
  type DataGridTableMeta,
  dataGridFeatures,
} from '../lib/data-grid-features'
import type { DataGridCellValueChange, DataGridDensity } from '../types'
import { useLatestCallback } from './use-latest-callback'

export interface UseDataGridOptions<TData extends RowData> {
  data: TData[]
  columns: DataGridColumnDef<TData>[]
  getRowId?: (row: TData, index: number) => string
  enableSorting?: boolean
  enableRowSelection?: boolean
  enableColumnResizing?: boolean
  enableColumnFilters?: boolean
  enablePagination?: boolean
  pageSize?: number
  density?: DataGridDensity
  onCellValueChange?: (change: DataGridCellValueChange) => void
  tableOptions?: Partial<TableOptions<DataGridFeatures, TData>>
}

export interface UseDataGridReturn<TData extends RowData> {
  table: ReactTable<DataGridFeatures, TData>
}

export function useDataGrid<TData extends RowData>({
  data,
  columns,
  getRowId,
  enableSorting = true,
  enableRowSelection = false,
  enableColumnResizing = true,
  enableColumnFilters = true,
  enablePagination = false,
  pageSize = 10,
  density: densityProp = 'short',
  onCellValueChange,
  tableOptions,
}: UseDataGridOptions<TData>): UseDataGridReturn<TData> {
  const initialState = tableOptions?.initialState
  const [sorting, setSorting] = useState<SortingState>(
    () => initialState?.sorting ?? [],
  )
  const [globalFilter, setGlobalFilter] = useState(
    () => initialState?.globalFilter ?? '',
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    () => initialState?.columnFilters ?? [],
  )
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>(() => initialState?.columnVisibility ?? {})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    () => initialState?.columnOrder ?? [],
  )
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    () => initialState?.columnPinning ?? { end: [], start: [] },
  )
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    () => initialState?.columnSizing ?? {},
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    () => initialState?.rowSelection ?? {},
  )
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? pageSize,
  })
  const [density, setDensity] = useState<DataGridDensity>(densityProp)

  const defaultColumn = useMemo<Partial<DataGridColumnDef<TData>>>(
    () => ({
      cell: (context) => createElement(DataGridCell<TData>, { context }),
      minSize: 80,
    }),
    [],
  )

  const consumerMeta = tableOptions?.meta
  const fallbackCellValueChange = consumerMeta?.onDataGridCellValueChange
  const hasCellValueChange = Boolean(
    onCellValueChange ?? fallbackCellValueChange,
  )
  const handleCellValueChange = useLatestCallback(
    (change: DataGridCellValueChange) =>
      (onCellValueChange ?? fallbackCellValueChange)?.(change),
  )
  const paginationRowOffset = enablePagination
    ? pagination.pageIndex * pagination.pageSize
    : 0
  const meta = useMemo<DataGridTableMeta>(
    () => ({
      ...consumerMeta,
      dataGridDensity: density,
      dataGridPaginationRowOffset: paginationRowOffset,
      onDataGridCellValueChange: hasCellValueChange
        ? handleCellValueChange
        : undefined,
      onDataGridDensityChange: setDensity,
    }),
    [
      consumerMeta,
      density,
      handleCellValueChange,
      hasCellValueChange,
      paginationRowOffset,
    ],
  )

  const table = useTable<DataGridFeatures, TData>({
    features: dataGridFeatures,
    data,
    columns,
    defaultColumn,
    getRowId,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      columnOrder,
      columnPinning,
      columnSizing,
      rowSelection,
      ...(enablePagination ? { pagination } : {}),
    },
    enableSorting,
    enableRowSelection,
    enableColumnResizing,
    enableColumnFilters,
    columnResizeMode: 'onChange',
    globalFilterFn: 'includesString',
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: !enablePagination,
    ...tableOptions,
    meta,
  })

  return { table }
}
