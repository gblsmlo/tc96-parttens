import type { ExpandedState, Row, RowData } from '@tanstack/react-table'
import type { DataGridFeatures } from './data-grid-features'

type GridRow<TData extends RowData> = Row<DataGridFeatures, TData>

export function isRowIdExpanded(
  rowId: string,
  expanded: ExpandedState | undefined,
) {
  if (expanded === true) return true
  return Boolean(expanded?.[rowId])
}

export function flattenExpandedRows<TData extends RowData>(
  rows: readonly GridRow<TData>[],
  expanded: ExpandedState | undefined,
) {
  const flat: GridRow<TData>[] = []
  const visit = (row: GridRow<TData>) => {
    flat.push(row)
    if (row.subRows.length > 0 && isRowIdExpanded(row.id, expanded)) {
      row.subRows.forEach(visit)
    }
  }
  rows.forEach(visit)
  return flat
}

interface AriaExpandedInput {
  canExpand: boolean
  expandable: boolean
  expanded: boolean
}

export function resolveAriaExpanded({
  canExpand,
  expandable,
  expanded,
}: AriaExpandedInput) {
  return expandable && canExpand ? expanded : undefined
}
