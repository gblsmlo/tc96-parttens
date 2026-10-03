'use client'

import type { RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { ActionBarContext } from '../../../shared/components/action-bar'
import type { DataGridTable } from '../lib/data-grid-features'

export type DataGridSelectionActionsProp<TData extends RowData> =
  | ReactNode
  | ((
      context: ActionBarContext<TData> & {
        clearSelection: () => void
      },
    ) => ReactNode)

export interface DataGridSelectionActionsProps<TData extends RowData> {
  selectionActions?: DataGridSelectionActionsProp<TData>
  table: DataGridTable<TData>
}

export function DataGridSelectionActions<TData extends RowData>({
  selectionActions,
  table,
}: DataGridSelectionActionsProps<TData>) {
  if (!selectionActions) return null
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)
  if (selectedRows.length === 0) return null

  const content =
    typeof selectionActions === 'function'
      ? selectionActions({
          clearSelection: () => table.resetRowSelection(),
          selectedCount: selectedRows.length,
          selectedRows,
        })
      : selectionActions
  if (!content) return null

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3"
      data-slot="data-grid-selection-actions"
    >
      <div className="pointer-events-auto">{content}</div>
    </div>
  )
}
