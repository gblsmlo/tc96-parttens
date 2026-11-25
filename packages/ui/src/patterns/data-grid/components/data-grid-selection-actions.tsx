'use client'

import type { RowData } from '@tanstack/react-table'
import {
  SelectionActions,
  type SelectionActionsProp,
} from '../../collection/shared/components/selection-actions'
import type { DataGridTable } from '../lib/data-grid-features'

export type DataGridSelectionActionsProp<TData extends RowData> =
  SelectionActionsProp<TData>

export interface DataGridSelectionActionsProps<TData extends RowData> {
  selectionActions?: DataGridSelectionActionsProp<TData>
  table: DataGridTable<TData>
}

export function DataGridSelectionActions<TData extends RowData>({
  selectionActions,
  table,
}: DataGridSelectionActionsProps<TData>) {
  return (
    <SelectionActions
      selectionActions={selectionActions}
      slot="data-grid-selection-actions"
      table={table}
    />
  )
}
