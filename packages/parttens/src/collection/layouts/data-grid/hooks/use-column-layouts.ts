import type { RowData } from '@tanstack/react-table'
import { useState } from 'react'
import { buildColumnLayouts } from '../lib/column-layout'
import type { DataGridColumn } from '../lib/data-grid-features'

export function useColumnLayouts<TData extends RowData>(
  columns: readonly DataGridColumn<TData>[],
  fillColumnId?: string,
) {
  const [layouts, setLayouts] = useState(() =>
    buildColumnLayouts(columns, fillColumnId),
  )
  const next = buildColumnLayouts(columns, fillColumnId, layouts)
  if (next !== layouts) setLayouts(next)
  return next
}
