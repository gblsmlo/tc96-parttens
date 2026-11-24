'use client'

import type { RowData } from '@tanstack/react-table'
import { RowDragHandle } from '../../../shared/components/row-drag-handle'
import type { DataGridColumnDef } from '../lib/data-grid-features'

const ROW_DRAG_TYPE = 'data-grid-row'
const ROW_SELECTOR = '[data-slot="data-grid-row"]'

export interface CreateRowDragColumnOptions<TData extends RowData> {
  getHandleLabel: (row: TData) => string
  headerLabel?: string
  size?: number
}

export function createRowDragColumn<TData extends RowData>({
  getHandleLabel,
  headerLabel,
  size = 40,
}: CreateRowDragColumnOptions<TData>): DataGridColumnDef<TData> {
  return {
    id: 'drag',
    meta: { align: 'center' },
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
        rowSelector={ROW_SELECTOR}
        slot="data-grid-row-drag-handle"
      />
    ),
  }
}
