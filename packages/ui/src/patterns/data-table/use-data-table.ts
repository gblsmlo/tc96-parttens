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
import { useControllableTableState } from '../collection/shared/hooks/use-controllable-table-state'
import { useLatestCallback } from '../collection/shared/hooks/use-latest-callback'
import { DataTableCell } from './data-table-cell'
import {
  type DataTableColumnDef,
  type DataTableFeatures,
  dataTableFeatures,
} from './data-table-features'
import type {
  DataTableCellValueChange,
  DataTableDensity,
  DataTableTableMeta,
} from './data-table-types'

export interface UseDataTableOptions<TData extends RowData> {
  /** Row data. */
  data: TData[]
  /** Column definitions. Declare `footer` or `meta.aggregations` on a column to render the table footer. */
  columns: DataTableColumnDef<TData>[]
  /** Stable row identity. Strongly recommended so selection survives reordering. */
  getRowId?: (row: TData, index: number) => string
  enableRowSelection?: boolean
  enableSorting?: boolean
  /** Header edges resize columns; the last visible column takes the remaining width. */
  enableColumnResizing?: boolean
  enableColumnFilters?: boolean
  /** Enables client-side pagination. */
  enablePagination?: boolean
  enableExpanding?: boolean
  getSubRows?: (row: TData, index: number) => TData[] | undefined
  /** Rows per page when pagination is enabled. Defaults to 10. */
  pageSize?: number
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
  expanded?: ExpandedState
  onExpandedChange?: (expanded: ExpandedState) => void
  density?: DataTableDensity
  onDensityChange?: (density: DataTableDensity) => void
  onCellValueChange?: (change: DataTableCellValueChange) => void
  /** Escape hatch for any TanStack Table option not surfaced above. */
  tableOptions?: Partial<TableOptions<DataTableFeatures, TData>>
}

export interface UseDataTableReturn<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>
}

/**
 * Wraps TanStack Table with the features the DataTable expects. Every table
 * state has a value and `on*Change` pair; without the value the hook keeps it,
 * seeded from `tableOptions.initialState`. Returns the table instance to hand
 * to `<DataTable table={table} />`.
 */
export function useDataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  enableRowSelection = false,
  enableSorting = false,
  enableColumnResizing = false,
  enableColumnFilters,
  enablePagination = false,
  enableExpanding = false,
  getSubRows,
  pageSize = 10,
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
  expanded: controlledExpanded,
  onExpandedChange,
  density: densityProp,
  onDensityChange,
  onCellValueChange,
  tableOptions,
}: UseDataTableOptions<TData>): UseDataTableReturn<TData> {
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
  const [expanded, setExpanded] = useControllableTableState<ExpandedState>(
    controlledExpanded,
    () => initialState?.expanded ?? {},
    onExpandedChange,
  )
  const [density, setDensity] = useControllableTableState<
    DataTableDensity | undefined
  >(
    onDensityChange ? densityProp : undefined,
    () => densityProp,
    (next) => {
      if (next) onDensityChange?.(next)
    },
  )

  const editable = Boolean(onCellValueChange)
  const handleCellValueChange = useLatestCallback(
    (change: DataTableCellValueChange) => onCellValueChange?.(change),
  )
  const consumerMeta = tableOptions?.meta
  const tracksDensity = Boolean(densityProp ?? onDensityChange)
  const meta = useMemo(() => {
    if (!(tracksDensity || editable)) return consumerMeta
    const tableMeta: DataTableTableMeta = {
      ...consumerMeta,
      ...(tracksDensity
        ? {
            dataGridDensity: density ?? 'short',
            onDataGridDensityChange: setDensity,
          }
        : {}),
      ...(editable
        ? { onDataTableCellValueChange: handleCellValueChange }
        : {}),
    }
    return tableMeta
  }, [
    consumerMeta,
    density,
    editable,
    handleCellValueChange,
    setDensity,
    tracksDensity,
  ])
  const defaultColumn = useMemo<Partial<DataTableColumnDef<TData>> | undefined>(
    () =>
      editable
        ? {
            cell: (context) => createElement(DataTableCell<TData>, { context }),
          }
        : undefined,
    [editable],
  )

  const table = useTable<DataTableFeatures, TData>({
    features: dataTableFeatures,
    data,
    columns,
    ...(defaultColumn ? { defaultColumn } : {}),
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
      pagination,
    },
    enableRowSelection,
    enableSorting,
    enableColumnResizing,
    ...(enableColumnFilters === undefined ? {} : { enableColumnFilters }),
    enableExpanding,
    ...(enableExpanding
      ? { autoResetExpanded: false, getSubRows, paginateExpandedRows: false }
      : {}),
    columnResizeMode: 'onChange',
    globalFilterFn: 'includesString',
    // Paginação é sempre registrada; desligada, a tabela entrega todas as linhas.
    manualPagination: !enablePagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    ...tableOptions,
    ...(meta === undefined ? {} : { meta }),
  })

  return { table }
}
