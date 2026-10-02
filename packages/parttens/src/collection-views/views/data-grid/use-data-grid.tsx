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
import { useMemo, useState } from 'react'
import { DataGridCell } from './data-grid-cells'
import {
  type DataGridColumnDef,
  type DataGridFeatures,
  dataGridFeatures,
} from './data-grid-features'
import type { DataGridCellValueChange, DataGridDensity } from './types'

export interface UseDataGridOptions<TData extends RowData> {
  /** Row data. */
  data: TData[]
  /** Column definitions. Attach `meta.variant` to opt into a default display renderer. */
  columns: DataGridColumnDef<TData>[]
  /** Stable row identity. Strongly recommended so selection survives reordering. */
  getRowId?: (row: TData, index: number) => string
  enableSorting?: boolean
  enableRowSelection?: boolean
  enableColumnResizing?: boolean
  enableColumnFilters?: boolean
  /** Enables client-side pagination. */
  enablePagination?: boolean
  /** Rows per page when pagination is enabled. Defaults to 10. */
  pageSize?: number
  /** Initial row density. Defaults to `short`. */
  density?: DataGridDensity
  /** Receives opt-in interactive cell changes. The consumer remains the owner of mutation. */
  onCellValueChange?: (change: DataGridCellValueChange) => void
  /** Escape hatch for any TanStack Table option not surfaced above. */
  tableOptions?: Partial<TableOptions<DataGridFeatures, TData>>
}

export interface UseDataGridReturn<TData extends RowData> {
  table: ReactTable<DataGridFeatures, TData>
}

/**
 * Wraps TanStack Table with the feature models and defaults the DataGrid expects.
 * Returns the table instance to hand to `<DataGrid table={table} />`.
 */
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
      cell: (context) => <DataGridCell context={context} />,
      minSize: 80,
    }),
    [],
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
    // Paginação é sempre registrada; desligada, a tabela entrega as linhas
    // pré-paginação, como fazia a v8 sem `getPaginationRowModel`.
    manualPagination: !enablePagination,
    ...tableOptions,
    meta: {
      ...tableOptions?.meta,
      dataGridDensity: density,
      dataGridPaginationRowOffset: enablePagination
        ? pagination.pageIndex * pagination.pageSize
        : 0,
      onDataGridDensityChange: setDensity,
      onDataGridCellValueChange:
        onCellValueChange ?? tableOptions?.meta?.onDataGridCellValueChange,
    },
  })

  return { table }
}
