'use client'

import { flexRender, type Row, type RowData } from '@tanstack/react-table'
import { TableCell, TableRow } from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import { memo } from 'react'
import { interactiveDescendants } from '../../shared/lib/interactive-descendants'
import type { DataTableFeatures, DataTableTable } from './use-data-table'

export interface DataTableRowProps<TData extends RowData> {
  canSelect: boolean
  meta: DataTableTable<TData>['options']['meta']
  onRowClick?: (row: Row<DataTableFeatures, TData>) => void
  openLabel?: string
  row: Row<DataTableFeatures, TData>
  selected: boolean
  visibleColumns: ReturnType<DataTableTable<TData>['getVisibleLeafColumns']>
}

function DataTableRowView<TData extends RowData>({
  onRowClick,
  openLabel,
  row,
  selected,
}: DataTableRowProps<TData>) {
  return (
    <TableRow
      className={onRowClick ? 'isolate' : undefined}
      data-interactive={onRowClick ? '' : undefined}
      data-state={selected ? 'selected' : undefined}
    >
      {row.getVisibleCells().map((cell, position) => (
        <TableCell
          className={
            onRowClick
              ? cn('pointer-events-none', interactiveDescendants)
              : undefined
          }
          key={cell.id}
        >
          {onRowClick && position === 0 ? (
            <button
              aria-label={openLabel}
              className="absolute inset-0 -z-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              data-slot="data-table-row-trigger"
              onClick={() => onRowClick(row)}
              type="button"
            />
          ) : null}
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export const DataTableRow = memo(DataTableRowView) as typeof DataTableRowView
