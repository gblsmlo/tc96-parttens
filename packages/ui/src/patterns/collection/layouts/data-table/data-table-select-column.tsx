'use client'

import type { RowData } from '@tanstack/react-table'
import { Checkbox } from '@tc96/ui/checkbox'
import type { DataTableColumnDef } from './data-table-features'

export interface CreateDataTableSelectColumnOptions<TData extends RowData> {
  selectAllLabel?: string
  getRowLabel?: (row: TData) => string
  size?: number
}

export function createDataTableSelectColumn<TData extends RowData>(
  options: CreateDataTableSelectColumnOptions<TData> = {},
): DataTableColumnDef<TData> {
  return {
    id: 'select',
    size: options.size ?? 40,
    enableSorting: false,
    enableHiding: false,
    enablePinning: false,
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
        aria-label={options.selectAllLabel ?? 'Selecionar todos os registros'}
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(Boolean(checked))
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={
          options.getRowLabel?.(row.original) ?? 'Selecionar registro'
        }
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
      />
    ),
  }
}
