import type { RowData } from '@tanstack/react-table'
import type { DataGridTable } from './data-grid-features'

export function moveColumn<TData extends RowData>(
  table: DataGridTable<TData>,
  columnId: string,
  direction: -1 | 1,
) {
  const leafIds = table.getAllLeafColumns().map((column) => column.id)
  const state = table.atoms.columnOrder.get()
  const order = state.length ? [...state] : leafIds
  const from = order.indexOf(columnId)
  const to = from + direction
  if (from === -1 || to < 0 || to >= order.length) return
  const [moved] = order.splice(from, 1)
  if (!moved) return
  order.splice(to, 0, moved)
  table.setColumnOrder(order)
}
