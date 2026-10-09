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
import { type ComponentProps, type ReactElement, useState } from 'react'
import { skeletonKeys } from '../../shared/lib/skeleton-keys'
import {
  aggregate,
  type DataTableAggregation,
  type DataTableAggregationLabels,
  type DataTableAggregations,
  type DataTableColumnMeta,
  defaultAggregationLabels,
} from './data-table-aggregation'
import { DataTableAggregationCell } from './data-table-aggregation-cell'
import { DataTableResizeHandle } from './data-table-resize-handle'
import { DataTableRow } from './data-table-row'
import type { DataTableTable } from './use-data-table'
import { useHorizontalOverflow } from './use-horizontal-overflow'

export interface DataTableProps<TData extends RowData>
  extends Omit<ComponentProps<'table'>, 'children'> {
  table: DataTableTable<TData>
  isLoading?: boolean
  loadingRowCount?: number
  emptyMessage?: string
  /** Moldura do DataGrid, para as duas views lerem como a mesma superfície. */
  bordered?: boolean
  aggregations?: DataTableAggregations
  defaultAggregations?: DataTableAggregations
  onAggregationsChange?: (aggregations: DataTableAggregations) => void
  aggregationLabels?: Partial<DataTableAggregationLabels>
}

const columnMetaOf = <TData,>(column: {
  columnDef: { meta?: unknown }
}): DataTableColumnMeta<TData> =>
  (column.columnDef.meta ?? {}) as DataTableColumnMeta<TData>

export function DataTable<TData extends RowData>({
  table,
  isLoading = false,
  loadingRowCount = 5,
  emptyMessage = 'Nenhum registro para exibir.',
  bordered = true,
  aggregations: controlledAggregations,
  defaultAggregations = {},
  onAggregationsChange,
  aggregationLabels,
  className,
  style,
  ...props
}: DataTableProps<TData>): ReactElement {
  const [uncontrolledAggregations, setUncontrolledAggregations] =
    useState<DataTableAggregations>(defaultAggregations)
  const aggregations = controlledAggregations ?? uncontrolledAggregations
  const labels = { ...defaultAggregationLabels, ...aggregationLabels }
  const changeAggregation = (
    columnId: string,
    aggregation: DataTableAggregation | null,
  ) => {
    const next = { ...aggregations, [columnId]: aggregation }
    if (controlledAggregations === undefined) setUncontrolledAggregations(next)
    onAggregationsChange?.(next)
  }
  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const columnCount = visibleColumns.length
  const resizable = Boolean(table.options.enableColumnResizing)
  const fillColumnId = visibleColumns.at(-1)?.id
  const meta = table.options.meta
  const aggregatedRows = table.getPrePaginatedRowModel().rows
  const showAggregations = !isLoading && aggregatedRows.length > 0
  const hasFooter = table
    .getAllLeafColumns()
    .some(
      (column) =>
        column.columnDef.footer ||
        (showAggregations && columnMetaOf<TData>(column).aggregations?.length),
    )
  const [scrollContainerRef, overflow] = useHorizontalOverflow<HTMLDivElement>()

  return (
    <div
      className="group/data-table relative min-w-0"
      data-overflow-end={overflow.end || undefined}
      data-overflow-start={overflow.start || undefined}
      data-slot="data-table"
    >
      <Table
        aria-busy={isLoading || undefined}
        render={
          <div
            className={bordered ? 'rounded-md border bg-background' : undefined}
            data-bordered={bordered ? '' : undefined}
            ref={scrollContainerRef}
          />
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
              <TableRow className="group/footer" key={footerGroup.id}>
                {footerGroup.headers.map((header) => {
                  const { column } = header
                  const meta = columnMetaOf<TData>(column)
                  const options = meta.aggregations ?? []
                  const selected = aggregations[column.id] ?? null
                  const aggregation =
                    selected && options.includes(selected) ? selected : null
                  const result =
                    aggregation === null
                      ? 0
                      : aggregate(aggregatedRows, aggregation, (row) =>
                          meta.getAggregationValue
                            ? meta.getAggregationValue(row.original)
                            : row.getValue(column.id),
                        )

                  const content =
                    header.isPlaceholder ? null : options.length === 0 ? (
                      flexRender(column.columnDef.footer, header.getContext())
                    ) : showAggregations ? (
                      <DataTableAggregationCell
                        align={meta.align}
                        labels={labels}
                        onValueChange={(next) =>
                          changeAggregation(column.id, next)
                        }
                        options={options}
                        result={
                          aggregation === null
                            ? null
                            : (meta.formatAggregation?.(result, aggregation) ??
                              String(result))
                        }
                        value={aggregation}
                      />
                    ) : null

                  return <TableCell key={header.id}>{content}</TableCell>
                })}
              </TableRow>
            ))}
          </TableFooter>
        ) : null}
      </Table>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-px start-px w-10 rounded-s-md bg-linear-to-r from-background to-transparent opacity-0 transition-opacity group-data-overflow-start/data-table:opacity-100 rtl:bg-linear-to-l"
        data-slot="data-table-overflow-start"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-px end-px w-10 rounded-e-md bg-linear-to-l from-background to-transparent opacity-0 transition-opacity group-data-overflow-end/data-table:opacity-100 rtl:bg-linear-to-r"
        data-slot="data-table-overflow-end"
      />
    </div>
  )
}
