// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import type { RowData } from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
import type { BodyEntry, RowBodyEntry } from '../lib/body-entries'
import type { ColumnLayouts } from '../lib/column-layout'
import type { CellSelection } from '../lib/selection'
import { createSkeletonRowIds } from '../lib/skeleton'
import type { DataGridDensity } from '../types'
import { DataGridEmptyRow } from './data-grid-empty-row'
import { DataGridGroupRow } from './data-grid-group-row'
import { DataGridRow } from './data-grid-row'
import { DataGridSkeletonRows } from './data-grid-skeleton-rows'

export interface DataGridBodyProps<TData extends RowData> {
  columnIds: readonly string[]
  columnLayouts: ColumnLayouts
  density: DataGridDensity
  emptyMessage: string
  entries: readonly BodyEntry<TData>[]
  focusedColumnId?: string
  focusedRowId?: string
  getRowSelected?: (row: TData) => boolean
  hasInteracted: boolean
  headerRowCount: number
  isLoading: boolean
  loadingRowCount: number
  minWidth: number
  onToggleGroup: (group: string, collapsed: boolean) => void
  pageRowCount: number
  selection: CellSelection
  totalSize?: number
  virtualItems: readonly VirtualItem[]
  virtualized: boolean
}

export function DataGridBody<TData extends RowData>({
  columnIds,
  columnLayouts,
  density,
  emptyMessage,
  entries,
  focusedColumnId,
  focusedRowId,
  getRowSelected,
  hasInteracted,
  headerRowCount,
  isLoading,
  loadingRowCount,
  minWidth,
  onToggleGroup,
  pageRowCount,
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
        ariaRowIndex={entry.ariaRowIndex}
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
      return virtualItems.map((item) => {
        const entry = entries[item.index]
        return entry?.kind === 'row'
          ? renderRow(entry, { size: item.size, start: item.start })
          : null
      })
    }
    return entries.map((entry) =>
      entry.kind === 'group' ? (
        <DataGridGroupRow
          ariaRowIndex={entry.ariaRowIndex}
          collapsed={entry.collapsed}
          count={entry.count}
          group={entry.group}
          key={entry.key}
          onToggle={onToggleGroup}
        />
      ) : (
        renderRow(entry)
      ),
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
