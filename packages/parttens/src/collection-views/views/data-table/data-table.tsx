'use client'

import { flexRender, type RowData } from '@tanstack/react-table'
import { Skeleton } from '@tc96/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import type { ComponentProps, ReactElement } from 'react'
import { DataTableRow } from './data-table-row'
import type { DataTableTable } from './use-data-table'

export interface DataTableProps<TData extends RowData>
  extends Omit<ComponentProps<'table'>, 'children'> {
  table: DataTableTable<TData>
  isLoading?: boolean
  loadingRowCount?: number
  emptyMessage?: string
  /** Moldura do DataGrid, para as duas views lerem como a mesma superfície. */
  bordered?: boolean
}

export function DataTable<TData extends RowData>({
  table,
  isLoading = false,
  loadingRowCount = 5,
  emptyMessage = 'Nenhum registro para exibir.',
  bordered = false,
  ...props
}: DataTableProps<TData>): ReactElement {
  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const columnCount = visibleColumns.length
  const meta = table.options.meta
  const hasFooter = table
    .getAllLeafColumns()
    .some((column) => column.columnDef.footer)

  return (
    <Table
      aria-busy={isLoading || undefined}
      render={
        bordered ? (
          <div className="rounded-md border bg-background" data-bordered="" />
        ) : undefined
      }
      {...props}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: loadingRowCount }, (_, position) => (
            <TableRow key={`loading-${position + 1}`}>
              {Array.from({ length: columnCount }, (_, cell) => (
                <TableCell key={`loading-${position + 1}-${cell + 1}`}>
                  <Skeleton className="h-4 min-w-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : rows.length ? (
          rows.map((row) => (
            <DataTableRow
              canSelect={row.getCanSelect()}
              key={row.id}
              meta={meta}
              row={row}
              selected={row.getIsSelected()}
              visibleColumns={visibleColumns}
            />
          ))
        ) : (
          <TableRow>
            <TableCell className="h-24 text-center" colSpan={columnCount}>
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {hasFooter ? (
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      ) : null}
    </Table>
  )
}
