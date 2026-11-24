import type { RowData } from '@tanstack/react-table'
import { useMemo } from 'react'
import {
  collectGroupRows,
  computeGroupRuns,
  countGroupRows,
  EMPTY_GROUP_RUNS,
  mapRowGroups,
} from '../../../shared/lib/group-runs'
import { buildBodyEntries } from '../lib/body-entries'
import type { DataGridTable } from '../lib/data-grid-features'
import { indexRowPositions, resolvePaginationRowOffset } from '../lib/row-index'
import { flattenExpandedRows } from '../lib/row-tree'

interface UseDataGridRowsOptions<TData extends RowData> {
  collapsedGroupIds: readonly string[]
  getRowGroup?: (row: TData) => string | null
  table: DataGridTable<TData>
  withGroupRows?: boolean
}

const NO_GROUPS: ReadonlyMap<string, string | null> = new Map()
const NO_COUNTS: ReadonlyMap<string, number> = new Map()
const NO_GROUP_ROWS: ReadonlyMap<string, never[]> = new Map()

export function useDataGridRows<TData extends RowData>({
  collapsedGroupIds,
  getRowGroup,
  table,
  withGroupRows = false,
}: UseDataGridRowsOptions<TData>) {
  const pageRows = table.getRowModel().rows
  const sortedRows = table.getSortedRowModel().rows
  const expandable = Boolean(table.options.enableExpanding)
  const expandedState =
    table.options.state?.expanded ?? table.atoms.expanded.get()
  const collectionRows = useMemo(
    () =>
      expandable ? flattenExpandedRows(sortedRows, expandedState) : sortedRows,
    [expandable, expandedState, sortedRows],
  )
  const headerRowCount = table.getHeaderGroups().length
  const paginationRowOffset = resolvePaginationRowOffset({
    expandable,
    manualPagination: Boolean(table.options.manualPagination),
    offset: table.options.meta?.dataGridPaginationRowOffset ?? 0,
  })

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
  const groupRows = useMemo(
    () =>
      getRowGroup && withGroupRows
        ? collectGroupRows(pageRows, groupByRowId)
        : NO_GROUP_ROWS,
    [getRowGroup, groupByRowId, pageRows, withGroupRows],
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
        groupRows,
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
      groupRows,
      groupRuns,
      headerRowCount,
      pageRows,
      paginationRowOffset,
      positions,
    ],
  )

  return {
    collectionRowCount: expandable
      ? collectionRows.length
      : table.getRowCount(),
    collectionRows,
    entries,
    groupRowCount: groupRuns.groupRowCount,
    headerRowCount,
    pageRows,
    paginationRowOffset,
    positions,
    rowIndexById,
    rows,
  }
}
