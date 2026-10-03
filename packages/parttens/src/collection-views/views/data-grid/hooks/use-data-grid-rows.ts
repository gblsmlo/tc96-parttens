import type { RowData } from '@tanstack/react-table'
import { useMemo } from 'react'
import { buildBodyEntries } from '../lib/body-entries'
import type { DataGridTable } from '../lib/data-grid-features'
import {
  computeGroupRuns,
  countGroupRows,
  EMPTY_GROUP_RUNS,
  mapRowGroups,
} from '../lib/group-runs'
import { indexRowPositions } from '../lib/row-index'

interface UseDataGridRowsOptions<TData extends RowData> {
  collapsedGroupIds: readonly string[]
  getRowGroup?: (row: TData) => string | null
  table: DataGridTable<TData>
}

const NO_GROUPS: ReadonlyMap<string, string | null> = new Map()
const NO_COUNTS: ReadonlyMap<string, number> = new Map()

export function useDataGridRows<TData extends RowData>({
  collapsedGroupIds,
  getRowGroup,
  table,
}: UseDataGridRowsOptions<TData>) {
  const pageRows = table.getRowModel().rows
  const collectionRows = table.getSortedRowModel().rows
  const headerRowCount = table.getHeaderGroups().length
  const paginationRowOffset =
    table.options.meta?.dataGridPaginationRowOffset ?? 0

  const positions = useMemo(
    () => indexRowPositions(collectionRows),
    [collectionRows],
  )
  const groupByRowId = useMemo(
    () =>
      getRowGroup
        ? mapRowGroups(collectionRows, pageRows, getRowGroup)
        : NO_GROUPS,
    [collectionRows, getRowGroup, pageRows],
  )
  const groupRuns = useMemo(
    () =>
      getRowGroup
        ? computeGroupRuns(collectionRows, groupByRowId)
        : EMPTY_GROUP_RUNS,
    [collectionRows, getRowGroup, groupByRowId],
  )
  const groupCounts = useMemo(
    () => (getRowGroup ? countGroupRows(pageRows, groupByRowId) : NO_COUNTS),
    [getRowGroup, groupByRowId, pageRows],
  )
  const collapsedGroups = useMemo(
    () => new Set(collapsedGroupIds),
    [collapsedGroupIds],
  )
  const rows = useMemo(
    () =>
      getRowGroup
        ? pageRows.filter((row) => {
            const group = groupByRowId.get(row.id)
            return !(group && collapsedGroups.has(group))
          })
        : pageRows,
    [collapsedGroups, getRowGroup, groupByRowId, pageRows],
  )
  const rowIndexById = useMemo(() => indexRowPositions(rows), [rows])
  const entries = useMemo(
    () =>
      buildBodyEntries({
        collapsedGroups,
        groupByRowId,
        groupCounts,
        groupRuns,
        headerRowCount,
        pageRows,
        paginationRowOffset,
        positions,
      }),
    [
      collapsedGroups,
      groupByRowId,
      groupCounts,
      groupRuns,
      headerRowCount,
      pageRows,
      paginationRowOffset,
      positions,
    ],
  )

  return {
    collectionRowCount: table.getRowCount(),
    collectionRows,
    entries,
    groupRowCount: groupRuns.groupRowCount,
    headerRowCount,
    pageRows,
    positions,
    rowIndexById,
    rows,
  }
}
