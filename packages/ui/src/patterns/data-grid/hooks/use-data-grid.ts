'use client'

import {
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ColumnVisibilityState,
  type ExpandedState,
  type PaginationState,
  type ReactTable,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  useTable,
} from '@tanstack/react-table'
import { createElement, useMemo } from 'react'
import { useControllableTableState } from '../../collection/shared/hooks/use-controllable-table-state'
import { useLatestCallback } from '../../collection/shared/hooks/use-latest-callback'
import { DataGridCell } from '../components/data-grid-cell'
import {
  type DataGridColumnDef,
  type DataGridFeatures,
  type DataGridTableMeta,
  dataGridFeatures,
} from '../lib/data-grid-features'
import type { DataGridCellValueChange, DataGridDensity } from '../types'

export interface UseDataGridOptions<TData extends RowData> {
  data: TData[]
  columns: DataGridColumnDef<TData>[]
  getRowId?: (row: TData, index: number) => string
  enableSorting?: boolean
  enableRowSelection?: boolean
  enableColumnResizing?: boolean
  enableColumnFilters?: boolean
  enablePagination?: boolean
  enableExpanding?: boolean
  getSubRows?: (row: TData, index: number) => TData[] | undefined
  expanded?: ExpandedState
  onExpandedChange?: (expanded: ExpandedState) => void
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  globalFilter?: unknown
  onGlobalFilterChange?: (globalFilter: unknown) => void
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (columnFilters: ColumnFiltersState) => void
  columnVisibility?: ColumnVisibilityState
  onColumnVisibilityChange?: (columnVisibility: ColumnVisibilityState) => void
  columnOrder?: ColumnOrderState
  onColumnOrderChange?: (columnOrder: ColumnOrderState) => void
  columnPinning?: ColumnPinningState
  onColumnPinningChange?: (columnPinning: ColumnPinningState) => void
  columnSizing?: ColumnSizingState
  onColumnSizingChange?: (columnSizing: ColumnSizingState) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  pageSize?: number
  density?: DataGridDensity
  onDensityChange?: (density: DataGridDensity) => void
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
  enableExpanding = false,
  getSubRows,
  expanded: controlledExpanded,
  onExpandedChange,
  sorting: controlledSorting,
  onSortingChange,
  globalFilter: controlledGlobalFilter,
  onGlobalFilterChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
  columnPinning: controlledColumnPinning,
  onColumnPinningChange,
  columnSizing: controlledColumnSizing,
  onColumnSizingChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  pagination: controlledPagination,
  onPaginationChange,
  pageSize = 10,
  density: densityProp = 'short',
  onDensityChange,
  onCellValueChange,
  tableOptions,
}: UseDataGridOptions<TData>): UseDataGridReturn<TData> {
  const initialState = tableOptions?.initialState
  const [sorting, setSorting] = useControllableTableState<SortingState>(
    controlledSorting,
    () => initialState?.sorting ?? [],
    onSortingChange,
  )
  const [globalFilter, setGlobalFilter] = useControllableTableState<unknown>(
    controlledGlobalFilter,
    () => initialState?.globalFilter ?? '',
    onGlobalFilterChange,
  )
  const [columnFilters, setColumnFilters] =
    useControllableTableState<ColumnFiltersState>(
      controlledColumnFilters,
      () => initialState?.columnFilters ?? [],
      onColumnFiltersChange,
    )
  const [columnVisibility, setColumnVisibility] =
    useControllableTableState<ColumnVisibilityState>(
      controlledColumnVisibility,
      () => initialState?.columnVisibility ?? {},
      onColumnVisibilityChange,
    )
  const [columnOrder, setColumnOrder] =
    useControllableTableState<ColumnOrderState>(
      controlledColumnOrder,
      () => initialState?.columnOrder ?? [],
      onColumnOrderChange,
    )
  const [columnPinning, setColumnPinning] =
    useControllableTableState<ColumnPinningState>(
      controlledColumnPinning,
      () => initialState?.columnPinning ?? { end: [], start: [] },
      onColumnPinningChange,
    )
  const [columnSizing, setColumnSizing] =
    useControllableTableState<ColumnSizingState>(
      controlledColumnSizing,
      () => initialState?.columnSizing ?? {},
      onColumnSizingChange,
    )
  const [rowSelection, setRowSelection] =
    useControllableTableState<RowSelectionState>(
      controlledRowSelection,
      () => initialState?.rowSelection ?? {},
      onRowSelectionChange,
    )
  const [pagination, setPagination] =
    useControllableTableState<PaginationState>(
      controlledPagination,
      () => ({
        pageIndex: initialState?.pagination?.pageIndex ?? 0,
        pageSize: initialState?.pagination?.pageSize ?? pageSize,
      }),
      onPaginationChange,
    )
  const [expanded, handleExpandedChange] =
    useControllableTableState<ExpandedState>(
      controlledExpanded,
      () => initialState?.expanded ?? {},
      onExpandedChange,
    )
  const [density, setDensity] = useControllableTableState<DataGridDensity>(
    onDensityChange ? densityProp : undefined,
    () => densityProp,
    onDensityChange,
  )

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
      setDensity,
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
      expanded,
      ...(enablePagination ? { pagination } : {}),
    },
    enableSorting,
    enableRowSelection,
    enableColumnResizing,
    enableColumnFilters,
    enableExpanding,
    ...(enableExpanding
      ? { autoResetExpanded: false, getSubRows, paginateExpandedRows: false }
      : {}),
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
    onExpandedChange: handleExpandedChange,
    onPaginationChange: setPagination,
    manualPagination: !enablePagination,
    ...tableOptions,
    meta,
  })

  return { table }
}
