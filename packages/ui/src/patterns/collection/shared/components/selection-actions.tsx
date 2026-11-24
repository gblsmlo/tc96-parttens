'use client'

import type { ReactNode } from 'react'
import type { ActionBarContext } from '../../../action-bar/components/action-bar'

export type SelectionActionsProp<TData> =
  | ReactNode
  | ((
      context: ActionBarContext<TData> & {
        clearSelection: () => void
      },
    ) => ReactNode)

export interface SelectionActionsTable<TData> {
  getSelectedRowModel: () => { rows: readonly { original: TData }[] }
  resetRowSelection: () => void
}

export interface SelectionActionsProps<TData> {
  selectionActions?: SelectionActionsProp<TData>
  slot: string
  table: SelectionActionsTable<TData>
}

export function SelectionActions<TData>({
  selectionActions,
  slot,
  table,
}: SelectionActionsProps<TData>) {
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
      data-slot={slot}
    >
      <div className="pointer-events-auto">{content}</div>
    </div>
  )
}
