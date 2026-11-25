'use client'

import { flexRender, type Row, type RowData } from '@tanstack/react-table'
import { TableCell, TableRow } from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import { memo } from 'react'
import { interactiveDescendants } from '../collection/shared/lib/interactive-descendants'
import { columnAlignClass } from './data-table-align'
import type { DataTableFeatures, DataTableTable } from './data-table-features'

export interface DataTableRowProps<TData extends RowData> {
  canSelect: boolean
  expanded: boolean
  meta: DataTableTable<TData>['options']['meta']
  onRowClick?: (row: Row<DataTableFeatures, TData>) => void
  openLabel?: string
  reorderable: boolean
  row: Row<DataTableFeatures, TData>
  selected: boolean
  visibleColumns: ReturnType<DataTableTable<TData>['getVisibleLeafColumns']>
}

function DataTableRowView<TData extends RowData>({
  onRowClick,
  openLabel,
  reorderable,
  row,
  selected,
}: DataTableRowProps<TData>) {
  return (
    <TableRow
      className={
        onRowClick || reorderable
          ? cn(
              onRowClick && 'isolate',
              reorderable && 'data-dnd-dragging:bg-background',
            )
          : undefined
      }
      data-interactive={onRowClick ? '' : undefined}
      data-state={selected ? 'selected' : undefined}
    >
      {row.getVisibleCells().map((cell, position) => (
        <TableCell
          className={
            cn(
              onRowClick && ['pointer-events-none', interactiveDescendants],
              columnAlignClass(cell.column),
            ) || undefined
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
