'use client'

import type { CellContext, RowData } from '@tanstack/react-table'
import { EditableInputCell } from '../../../shared/components/editable-input-cell'
import { toStringValue } from '../../../shared/lib/format-value'
import { CELL_ALIGN, CELL_SELECTOR } from '../lib/constants'
import type { DataGridFeatures } from '../lib/data-grid-features'
import type { DataGridColumnMeta } from '../types'

export function DataGridInputCell<TData extends RowData>({
  context,
  numeric,
}: {
  context: CellContext<DataGridFeatures, TData, unknown>
  numeric: boolean
}) {
  const { column, getValue, row, table } = context
  const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta

  return (
    <EditableInputCell
      alignClassName={CELL_ALIGN[meta.align ?? 'start']}
      cellSelector={CELL_SELECTOR}
      columnId={column.id}
      meta={meta}
      numeric={numeric}
      onValueChange={table.options.meta?.onDataGridCellValueChange}
      row={row}
      slot="data-grid-input-cell"
      triggerAttribute="data-grid-input-trigger"
      value={toStringValue(getValue())}
    />
  )
}
