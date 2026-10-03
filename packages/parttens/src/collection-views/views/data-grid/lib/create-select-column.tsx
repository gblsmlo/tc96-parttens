'use client'

import type { RowData } from '@tanstack/react-table'
import { Checkbox } from '@tc96/ui/checkbox'
import type { DataGridColumnDef } from './data-grid-features'

export function createSelectColumn<TData extends RowData>(
  options: { showRowNumbers?: boolean; size?: number } = {},
): DataGridColumnDef<TData> {
  const showRowNumbers = options.showRowNumbers ?? true

  return {
    id: 'select',
    meta: { align: 'center' },
    size: options.size ?? 44,
    enableSorting: false,
    enableHiding: false,
    enablePinning: false,
    enableResizing: false,
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Selecionar todos os registros"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(Boolean(checked))
          }
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="group/marker relative flex size-full items-center justify-center">
        {showRowNumbers ? (
          <span
            aria-hidden="true"
            className="pointer-coarse:opacity-0 text-muted-foreground text-xs tabular-nums group-hover/marker:opacity-0 group-focus-within/marker:opacity-0 group-data-[state=selected]/marker:opacity-0"
            data-slot="data-grid-row-marker"
          >
            {row.index + 1}
          </span>
        ) : null}
        <Checkbox
          aria-label="Selecionar registro"
          checked={row.getIsSelected()}
          className={
            showRowNumbers
              ? 'pointer-coarse:opacity-100 absolute opacity-0 group-hover/marker:opacity-100 group-focus-within/marker:opacity-100 data-checked:opacity-100'
              : undefined
          }
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
        />
      </div>
    ),
  }
}
