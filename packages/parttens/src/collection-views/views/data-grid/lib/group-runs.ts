import type { Row, RowData } from '@tanstack/react-table'
import type { DataGridFeatures } from './data-grid-features'

type GridRow<TData extends RowData> = Row<DataGridFeatures, TData>

export interface GroupRuns {
  groupRowCount: number
  runStarts: boolean[]
  runsThrough: number[]
}

export const EMPTY_GROUP_RUNS: GroupRuns = {
  groupRowCount: 0,
  runStarts: [],
  runsThrough: [],
}

export function mapRowGroups<TData extends RowData>(
  collectionRows: readonly GridRow<TData>[],
  pageRows: readonly GridRow<TData>[],
  getRowGroup: (row: TData) => string | null,
) {
  const groups = new Map<string, string | null>()
  for (const row of collectionRows) {
    groups.set(row.id, getRowGroup(row.original))
  }
  for (const row of pageRows) {
    if (!groups.has(row.id)) groups.set(row.id, getRowGroup(row.original))
  }
  return groups
}

export function computeGroupRuns<TData extends RowData>(
  collectionRows: readonly GridRow<TData>[],
  groupByRowId: ReadonlyMap<string, string | null>,
): GroupRuns {
  const runsThrough: number[] = []
  const runStarts: boolean[] = []
  let previousGroup: string | null = null
  let groupRowCount = 0
  for (const row of collectionRows) {
    const group = groupByRowId.get(row.id) ?? null
    const startsRun = Boolean(group && group !== previousGroup)
    if (group && startsRun) {
      groupRowCount += 1
      previousGroup = group
    }
    runsThrough.push(groupRowCount)
    runStarts.push(startsRun)
  }
  return { groupRowCount, runStarts, runsThrough }
}

export function countGroupRows<TData extends RowData>(
  pageRows: readonly GridRow<TData>[],
  groupByRowId: ReadonlyMap<string, string | null>,
) {
  const counts = new Map<string, number>()
  for (const row of pageRows) {
    const group = groupByRowId.get(row.id)
    if (group) counts.set(group, (counts.get(group) ?? 0) + 1)
  }
  return counts
}
