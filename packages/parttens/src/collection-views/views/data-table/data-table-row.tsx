'use client'

import { flexRender, type Row, type RowData } from '@tanstack/react-table'
import { TableCell, TableRow } from '@tc96/ui/table'
import { memo } from 'react'
import type { DataTableFeatures, DataTableTable } from './use-data-table'

export interface DataTableRowProps<TData extends RowData> {
  canSelect: boolean
  meta: DataTableTable<TData>['options']['meta']
  row: Row<DataTableFeatures, TData>
  selected: boolean
  visibleColumns: ReturnType<DataTableTable<TData>['getVisibleLeafColumns']>
}

function DataTableRowView<TData extends RowData>({
  row,
  selected,
}: DataTableRowProps<TData>) {
  return (
    <TableRow data-state={selected ? 'selected' : undefined}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export const DataTableRow = memo(DataTableRowView) as typeof DataTableRowView
