'use client'

import type { CellContext, RowData } from '@tanstack/react-table'
import { EditableInputCell } from '../collection/shared/components/editable-input-cell'
import { toStringValue } from '../collection/shared/lib/format-value'
import type { DataTableColumnMeta } from './data-table-aggregation'
import type { DataTableFeatures } from './data-table-features'
import type { DataTableTableMeta } from './data-table-types'

const ALIGN_CLASS = {
  center: 'text-center',
  end: 'text-end',
  start: 'text-start',
} as const

export function DataTableCell<TData extends RowData>({
  context,
}: {
  context: CellContext<DataTableFeatures, TData, unknown>
}) {
  const { column, getValue, row, table } = context
  const meta = (column.columnDef.meta ?? {}) as DataTableColumnMeta<TData>
  const onValueChange = (table.options.meta as DataTableTableMeta | undefined)
    ?.onDataTableCellValueChange
  const value = toStringValue(getValue())

  if (!(meta.editable && onValueChange)) return value || null

  return (
    <EditableInputCell
      alignClassName={ALIGN_CLASS[meta.align ?? 'start']}
      cellSelector='[data-slot="table-cell"]'
      columnId={column.id}
      meta={meta}
      numeric={meta.variant === 'number'}
      onValueChange={onValueChange}
      row={row}
      slot="data-table-input-cell"
      triggerAttribute="data-table-input-trigger"
      value={value}
    />
  )
}
