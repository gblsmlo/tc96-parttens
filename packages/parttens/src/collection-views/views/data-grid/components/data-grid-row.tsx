// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import type { Row, RowData } from '@tanstack/react-table'
import { cn } from '@tc96/utils'
import { memo, useCallback, useMemo } from 'react'
import { useDataGridRowContext } from '../hooks/use-data-grid-row-context'
import { ROW_DENSITY } from '../lib/constants'
import type { DataGridFeatures } from '../lib/data-grid-features'
import { DataGridBodyCell } from './data-grid-body-cell'

export interface DataGridRowProps<TData extends RowData> {
  ariaRowIndex: number
  focusedColumnId?: string
  interacted: boolean
  row: Row<DataGridFeatures, TData>
  selected: boolean
  selectedColumnIds?: ReadonlySet<string>
  virtualSize?: number
  virtualStart?: number
}

function DataGridRowView<TData extends RowData>({
  ariaRowIndex,
  focusedColumnId,
  interacted,
  row,
  selected,
  selectedColumnIds,
  virtualSize,
  virtualStart,
}: DataGridRowProps<TData>) {
  const { columnLayouts, density, interactions, rowSelectable, meta } =
    useDataGridRowContext()
  const rowId = row.id
  const registerRef = useCallback(
    (node: HTMLDivElement | null) => interactions.registerRow(rowId, node),
    [interactions, rowId],
  )
  const virtualStyle = useMemo(
    () =>
      virtualStart === undefined
        ? undefined
        : {
            height: virtualSize,
            transform: `translateY(${virtualStart}px)`,
          },
    [virtualSize, virtualStart],
  )

  return (
    <div
      aria-rowindex={ariaRowIndex}
      aria-selected={rowSelectable ? selected : undefined}
      className={cn(
        'group flex w-full border-b transition-colors last:border-b-0 hover:bg-accent/40 data-[state=selected]:bg-primary/10',
        ROW_DENSITY[density],
        virtualStyle && 'absolute start-0 top-0',
      )}
      data-slot="data-grid-row"
      data-state={selected ? 'selected' : undefined}
      ref={registerRef}
      role="row"
      style={virtualStyle}
      tabIndex={-1}
    >
      {row.getVisibleCells().map((cell, columnIndex) => {
        const isFocused = focusedColumnId === cell.column.id
        return (
          <DataGridBodyCell
            canSelect={row.getCanSelect()}
            cell={cell}
            columnIndex={columnIndex}
            density={density}
            interactions={interactions}
            isFocused={isFocused}
            isSelected={selectedColumnIds?.has(cell.column.id) ?? false}
            key={cell.id}
            layout={columnLayouts.get(cell.column.id)}
            rowSelected={selected}
            showFocus={isFocused && interacted}
            meta={meta}
          />
        )
      })}
    </div>
  )
}

export const DataGridRow = memo(DataGridRowView) as typeof DataGridRowView
