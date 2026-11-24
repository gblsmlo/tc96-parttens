'use client'

import {
  type ColumnDef,
  type ColumnSizingState,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  type PaginationState,
  type ReactTable,
  type RowData,
  type RowSelectionState,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  type SortingState,
  sortFns,
  type Table,
  type TableOptions,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useState } from 'react'

/** Features, row models and sort registry the DataTable relies on. */
export const dataTableFeatures = tableFeatures({
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

export type DataTableFeatures = typeof dataTableFeatures

/** Table instance consumed by `<DataTable />`. */
export type DataTableTable<TData extends RowData> = Table<
  DataTableFeatures,
  TData
>

export type DataTableColumnDef<TData extends RowData> = ColumnDef<
  DataTableFeatures,
  TData,
  unknown
>

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
  /** Enables client-side pagination. */
  enablePagination?: boolean
  /** Rows per page when pagination is enabled. Defaults to 10. */
  pageSize?: number
  /** Escape hatch for any TanStack Table option not surfaced above. */
  tableOptions?: Partial<TableOptions<DataTableFeatures, TData>>
}

export interface UseDataTableReturn<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>
}

/**
 * Wraps TanStack Table with the features the DataTable expects — selection,
 * sorting and optional pagination. Returns the table instance to hand to
 * `<DataTable table={table} />`.
 */
export function useDataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  enableRowSelection = false,
  enableSorting = false,
  enableColumnResizing = false,
  enablePagination = false,
  pageSize = 10,
  tableOptions,
}: UseDataTableOptions<TData>): UseDataTableReturn<TData> {
  const initialState = tableOptions?.initialState
  const [sorting, setSorting] = useState<SortingState>(
    () => initialState?.sorting ?? [],
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

  const table = useTable<DataTableFeatures, TData>({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    state: { sorting, columnSizing, rowSelection, pagination },
    enableRowSelection,
    enableSorting,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    // Paginação é sempre registrada; desligada, a tabela entrega todas as linhas.
    manualPagination: !enablePagination,
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    ...tableOptions,
  })

  return { table }
}
