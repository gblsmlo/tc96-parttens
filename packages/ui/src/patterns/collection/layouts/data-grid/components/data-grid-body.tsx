// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import type { RowData } from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
import type { ReactNode } from 'react'
import type { BodyEntry, RowBodyEntry } from '../lib/body-entries'
import type { ColumnLayouts } from '../lib/column-layout'
import { ROW_HEIGHT } from '../lib/constants'
import type { DataGridColumn } from '../lib/data-grid-features'
import { resolveAriaExpanded } from '../lib/row-tree'
import type { CellSelection } from '../lib/selection'
import { createSkeletonRowIds } from '../lib/skeleton'
import type { DataGridDensity } from '../types'
import { DataGridEmptyRow } from './data-grid-empty-row'
import {
  type DataGridGroupCellContext,
  DataGridGroupRow,
} from './data-grid-group-row'
import { DataGridRow } from './data-grid-row'
import {
  type DataGridRowSkeletonAnatomy,
  DataGridSkeletonRows,
} from './data-grid-skeleton-rows'

export interface DataGridBodyProps<TData extends RowData> {
  columnIds: readonly string[]
  columnLayouts: ColumnLayouts
  columns: readonly DataGridColumn<TData>[]
  density: DataGridDensity
  emptyMessage: string
  entries: readonly BodyEntry<TData>[]
  expandable: boolean
  focusedColumnId?: string
  focusedRowId?: string
  getRowSelected?: (row: TData) => boolean
  hasInteracted: boolean
  headerRowCount: number
  isLoading: boolean
  labelColumnId?: string
  loadingMoreRowCount: number
  loadingMoreRowIndexOffset: number
  loadingRowAnatomy?: DataGridRowSkeletonAnatomy
  loadingRowCount: number
  minWidth: number
  onToggleGroup: (group: string, collapsed: boolean) => void
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  pageRowCount: number
  renderGroupCell?: (context: DataGridGroupCellContext<TData>) => ReactNode
  selection: CellSelection
  totalSize?: number
  virtualItems: readonly VirtualItem[]
  virtualized: boolean
}

export function DataGridBody<TData extends RowData>({
  columnIds,
  columnLayouts,
  columns,
  density,
  emptyMessage,
  entries,
  expandable,
  focusedColumnId,
  focusedRowId,
  getRowSelected,
  hasInteracted,
  headerRowCount,
  isLoading,
  labelColumnId,
  loadingMoreRowCount,
  loadingMoreRowIndexOffset,
  loadingRowAnatomy,
  loadingRowCount,
  minWidth,
  onToggleGroup,
  pageRowCount,
  renderGroupCell,
  getGroupToggleLabel,
  selection,
  totalSize,
  virtualItems,
  virtualized,
}: DataGridBodyProps<TData>) {
  function renderRow(
    entry: RowBodyEntry<TData>,
    virtual?: { size: number; start: number },
  ) {
    const { row } = entry
    const focusedHere = focusedRowId === row.id
    return (
      <DataGridRow
        ariaLevel={expandable ? row.depth + 1 : undefined}
        ariaRowIndex={entry.ariaRowIndex}
        expanded={resolveAriaExpanded({
          canExpand: expandable && row.getCanExpand(),
          expandable,
          expanded: expandable && row.getIsExpanded(),
        })}
        focusedColumnId={focusedHere ? focusedColumnId : undefined}
        interacted={focusedHere && hasInteracted}
        key={entry.key}
        row={row}
        selected={
          Boolean(getRowSelected?.(row.original)) || row.getIsSelected()
        }
        selectedColumnIds={selection.get(row.id)}
        virtualSize={virtual?.size}
        virtualStart={virtual?.start}
      />
    )
  }

  function renderContent() {
    if (isLoading) {
      return (
        <DataGridSkeletonRows
          {...(loadingRowAnatomy ? { anatomy: loadingRowAnatomy } : {})}
          columnIds={columnIds}
          columnLayouts={columnLayouts}
          density={density}
          headerRowCount={headerRowCount}
          rowIds={createSkeletonRowIds(loadingRowCount)}
        />
      )
    }
    if (pageRowCount === 0) {
      return (
        <DataGridEmptyRow
          ariaRowIndex={headerRowCount + 1}
          message={emptyMessage}
        />
      )
    }
    if (virtualized) {
      return (
        <>
          {virtualItems.map((item) => {
            const entry = entries[item.index]
            return entry?.kind === 'row'
              ? renderRow(entry, { size: item.size, start: item.start })
              : null
          })}
          {renderLoadingMore(
            (totalSize ?? 0) - loadingMoreRowCount * ROW_HEIGHT[density],
          )}
        </>
      )
    }
    return (
      <>
        {entries.map((entry) =>
          entry.kind === 'group' ? (
            <DataGridGroupRow
              ariaRowIndex={entry.ariaRowIndex}
              collapsed={entry.collapsed}
              columnLayouts={columnLayouts}
              columns={columns}
              count={entry.count}
              group={entry.group}
              key={entry.key}
              labelColumnId={labelColumnId}
              getGroupToggleLabel={getGroupToggleLabel}
              onToggle={onToggleGroup}
              renderGroupCell={renderGroupCell}
              rows={entry.rows}
            />
          ) : (
            renderRow(entry)
          ),
        )}
        {renderLoadingMore()}
      </>
    )
  }

  function renderLoadingMore(virtualStart?: number) {
    if (loadingMoreRowCount === 0) return null
    return (
      <DataGridSkeletonRows
        {...(loadingRowAnatomy ? { anatomy: loadingRowAnatomy } : {})}
        columnIds={columnIds}
        columnLayouts={columnLayouts}
        density={density}
        headerRowCount={headerRowCount}
        loadingMore
        rowIds={createSkeletonRowIds(loadingMoreRowCount)}
        rowIndexOffset={loadingMoreRowIndexOffset}
        virtualStart={virtualStart}
      />
    )
  }

  return (
    <div
      className="relative grid"
      data-slot="data-grid-body"
      data-virtualized={virtualized ? 'true' : undefined}
      role="rowgroup"
      style={{ height: virtualized ? totalSize : undefined, minWidth }}
    >
      {renderContent()}
    </div>
  )
}
