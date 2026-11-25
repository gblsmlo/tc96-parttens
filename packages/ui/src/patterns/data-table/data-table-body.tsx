'use client'

import type { Row, RowData } from '@tanstack/react-table'
import { TableBody } from '@tc96/ui/table'
import { type ReactNode, useMemo } from 'react'
import { RowReorderProvider } from '../collection/shared/components/row-reorder-provider'
import { useLatestCallback } from '../collection/shared/hooks/use-latest-callback'
import {
  collectGroupRows,
  countGroupRows,
  splitGroupSections,
} from '../collection/shared/lib/group-runs'
import type { DataTableFeatures, DataTableTable } from './data-table-features'
import {
  type DataTableGroupCellContext,
  DataTableGroupRow,
} from './data-table-group-row'
import { DataTableRow } from './data-table-row'
import type {
  DataTableRowDragAnnouncements,
  DataTableRowMove,
} from './data-table-types'

type TableRowOf<TData extends RowData> = Row<DataTableFeatures, TData>

export interface DataTableBodyProps<TData extends RowData> {
  collapsedGroupIds: readonly string[]
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  getRowGroup?: (row: TData) => string | null
  getRowCanOpen?: (row: TableRowOf<TData>) => boolean
  getRowOpenLabel?: (row: TableRowOf<TData>) => string
  loadingMore: ReactNode
  meta: DataTableTable<TData>['options']['meta']
  onRowClick?: (row: TableRowOf<TData>) => void
  onRowMove?: (move: DataTableRowMove) => void
  onToggleGroup: (group: string, collapsed: boolean) => void
  renderGroupCell?: (context: DataTableGroupCellContext<TData>) => ReactNode
  reorderActive: boolean
  rowDragAnnouncements?: DataTableRowDragAnnouncements
  rows: readonly TableRowOf<TData>[]
  table: DataTableTable<TData>
  visibleColumns: ReturnType<DataTableTable<TData>['getVisibleLeafColumns']>
}

const defaultRowOpenLabel = 'Abrir registro'
const NON_LABEL_COLUMN_IDS: readonly string[] = ['select', 'actions', 'drag']
const NO_ROW_GROUPS: ReadonlyMap<string, string | null> = new Map()

export function DataTableBody<TData extends RowData>({
  collapsedGroupIds,
  getGroupToggleLabel,
  getRowCanOpen,
  getRowGroup,
  getRowOpenLabel,
  loadingMore,
  meta,
  onRowClick,
  onRowMove,
  onToggleGroup,
  renderGroupCell,
  reorderActive,
  rowDragAnnouncements,
  rows,
  table,
  visibleColumns,
}: DataTableBodyProps<TData>) {
  const groupByRowId = useMemo(
    () =>
      getRowGroup
        ? new Map(rows.map((row) => [row.id, getRowGroup(row.original)]))
        : NO_ROW_GROUPS,
    [getRowGroup, rows],
  )
  const indexByRowId = useMemo(
    () => new Map(rows.map((row, index) => [row.id, index])),
    [rows],
  )
  const rowIds = useMemo(() => rows.map((row) => row.id), [rows])
  const getCollectionIndexes = useLatestCallback(() => {
    const positions = new Map(
      table
        .getPrePaginatedRowModel()
        .rows.map((row, position) => [row.id, position]),
    )
    return rows.map((row, index) => positions.get(row.id) ?? index)
  })

  const renderRow = (row: TableRowOf<TData>) => {
    const opens = onRowClick && (getRowCanOpen?.(row) ?? true)
    return (
      <DataTableRow
        canSelect={row.getCanSelect()}
        expanded={row.getIsExpanded()}
        key={row.id}
        meta={meta}
        onRowClick={opens ? onRowClick : undefined}
        openLabel={
          opens ? (getRowOpenLabel?.(row) ?? defaultRowOpenLabel) : undefined
        }
        reorderable={reorderActive}
        row={row}
        selected={row.getIsSelected()}
        visibleColumns={visibleColumns}
      />
    )
  }

  if (!getRowGroup) {
    return (
      <RowReorderProvider
        active={reorderActive}
        announcements={rowDragAnnouncements}
        getCollectionIndexes={getCollectionIndexes}
        indexByRowId={indexByRowId}
        onRowMove={onRowMove}
        rowIds={rowIds}
      >
        <TableBody>
          {rows.map(renderRow)}
          {loadingMore}
        </TableBody>
      </RowReorderProvider>
    )
  }

  const collapsed = new Set(collapsedGroupIds)
  const counts = countGroupRows(rows, groupByRowId)
  const rowsByGroup = renderGroupCell
    ? collectGroupRows(rows, groupByRowId)
    : undefined
  const labelColumnId = visibleColumns.find(
    (column) => !NON_LABEL_COLUMN_IDS.includes(column.id),
  )?.id
  const sections = splitGroupSections(rows, groupByRowId)

  return sections.map((section, index) => {
    const { group } = section
    const isCollapsed = group !== null && collapsed.has(group)
    const isLast = index === sections.length - 1
    return (
      <TableBody key={`${group ?? ''}:${section.rows[0]?.id ?? index}`}>
        {group === null ? null : (
          <DataTableGroupRow
            collapsed={isCollapsed}
            columns={visibleColumns}
            count={counts.get(group) ?? 0}
            getGroupToggleLabel={getGroupToggleLabel}
            group={group}
            labelColumnId={labelColumnId}
            onToggle={onToggleGroup}
            renderGroupCell={renderGroupCell}
            rows={rowsByGroup?.get(group) ?? section.rows}
          />
        )}
        {isCollapsed ? null : section.rows.map(renderRow)}
        {isLast ? loadingMore : null}
      </TableBody>
    )
  })
}
