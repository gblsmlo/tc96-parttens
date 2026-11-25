import type { Row, RowData } from '@tanstack/react-table'
import type { GroupRuns } from '../../collection/shared/lib/group-runs'
import type { DataGridFeatures } from './data-grid-features'
import { resolveCollectionRowIndex } from './row-index'

type GridRow<TData extends RowData> = Row<DataGridFeatures, TData>

export interface GroupBodyEntry<TData extends RowData> {
  ariaRowIndex: number
  collapsed: boolean
  count: number
  group: string
  key: string
  kind: 'group'
  rows: readonly GridRow<TData>[]
}

export interface RowBodyEntry<TData extends RowData> {
  ariaRowIndex: number
  key: string
  kind: 'row'
  row: GridRow<TData>
}

export type BodyEntry<TData extends RowData> =
  | GroupBodyEntry<TData>
  | RowBodyEntry<TData>

interface BodyEntriesInput<TData extends RowData> {
  collapsedGroups: ReadonlySet<string>
  groupByRowId: ReadonlyMap<string, string | null>
  groupCounts: ReadonlyMap<string, number>
  groupRows: ReadonlyMap<string, readonly GridRow<TData>[]>
  groupRuns: GroupRuns
  headerRowCount: number
  pageRows: readonly GridRow<TData>[]
  paginationRowOffset: number
  positions: ReadonlyMap<string, number>
}

const NO_GROUP_ROWS: readonly never[] = []

export function buildBodyEntries<TData extends RowData>({
  collapsedGroups,
  groupByRowId,
  groupCounts,
  groupRows,
  groupRuns,
  headerRowCount,
  pageRows,
  paginationRowOffset,
  positions,
}: BodyEntriesInput<TData>): BodyEntry<TData>[] {
  const entries: BodyEntry<TData>[] = []
  pageRows.forEach((row, rowIndex) => {
    const group = groupByRowId.get(row.id) ?? null
    const collectionIndex = resolveCollectionRowIndex({
      fallbackIndex: rowIndex,
      paginationRowOffset,
      positions,
      row,
    })
    const runPosition = positions.get(row.id) ?? -1
    const groupRunsBefore = groupRuns.runsThrough[runPosition] ?? 0
    const collapsed = group !== null && collapsedGroups.has(group)
    const startsGroup = Boolean(
      group && (groupRuns.runStarts[runPosition] || rowIndex === 0),
    )

    if (startsGroup && group) {
      entries.push({
        ariaRowIndex: headerRowCount + collectionIndex + groupRunsBefore,
        collapsed,
        count: groupCounts.get(group) ?? 0,
        group,
        key: `group-${group}-${row.id}`,
        kind: 'group',
        rows: groupRows.get(group) ?? NO_GROUP_ROWS,
      })
    }
    if (!collapsed) {
      entries.push({
        ariaRowIndex: headerRowCount + collectionIndex + groupRunsBefore + 1,
        key: row.id,
        kind: 'row',
        row,
      })
    }
  })
  return entries
}
