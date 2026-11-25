'use client'

import type { RowData } from '@tanstack/react-table'
import { RowDragHandle } from '../collection/shared/components/row-drag-handle'
import type { DataTableColumnDef } from './data-table-features'

const ROW_DRAG_TYPE = 'data-table-row'

export interface CreateDataTableRowDragColumnOptions<TData extends RowData> {
  getHandleLabel: (row: TData) => string
  headerLabel?: string
  size?: number
}

export function createDataTableRowDragColumn<TData extends RowData>({
  getHandleLabel,
  headerLabel,
  size = 40,
}: CreateDataTableRowDragColumnOptions<TData>): DataTableColumnDef<TData> {
  return {
    id: 'drag',
    size,
    enableSorting: false,
    enableHiding: false,
    enablePinning: false,
    enableResizing: false,
    header: () =>
      headerLabel ? <span className="sr-only">{headerLabel}</span> : null,
    cell: ({ row }) => (
      <RowDragHandle
        dragType={ROW_DRAG_TYPE}
        label={getHandleLabel(row.original)}
        rowId={row.id}
        rowSelector="tr"
        slot="data-table-row-drag-handle"
      />
    ),
  }
}
