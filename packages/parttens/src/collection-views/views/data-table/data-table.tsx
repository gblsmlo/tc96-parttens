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
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement } from 'react'
import { skeletonKeys } from '../../shared/lib/skeleton-keys'
import { DataTableResizeHandle } from './data-table-resize-handle'
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
  className,
  style,
  ...props
}: DataTableProps<TData>): ReactElement {
  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const columnCount = visibleColumns.length
  const resizable = Boolean(table.options.enableColumnResizing)
  const fillColumnId = visibleColumns.at(-1)?.id
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
      className={cn(
        resizable &&
          'table-fixed [&_td]:overflow-hidden [&_td]:text-ellipsis [&_th]:overflow-hidden',
        className,
      )}
      style={resizable ? { minWidth: table.getTotalSize(), ...style } : style}
      {...props}
    >
      {resizable ? (
        <colgroup>
          {visibleColumns.map((column) => (
            <col
              key={column.id}
              style={
                column.id === fillColumnId
                  ? undefined
                  : { width: column.getSize() }
              }
            />
          ))}
        </colgroup>
      ) : null}
      <TableHeader className="not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] dark:not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className={resizable ? 'relative' : undefined}
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                {resizable &&
                !header.isPlaceholder &&
                header.subHeaders.length === 0 &&
                header.column.id !== fillColumnId &&
                header.column.getCanResize() ? (
                  <DataTableResizeHandle header={header} table={table} />
                ) : null}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          skeletonKeys('loading', loadingRowCount).map((rowKey) => (
            <TableRow key={rowKey}>
              {skeletonKeys(rowKey, columnCount).map((cellKey) => (
                <TableCell key={cellKey}>
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
