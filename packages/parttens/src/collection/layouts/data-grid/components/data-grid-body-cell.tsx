// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import { type Cell, flexRender, type RowData } from '@tanstack/react-table'
import { cn } from '@tc96/utils'
import { memo } from 'react'
import type { CellInteractions } from '../hooks/use-data-grid-cell-events'
import type { ColumnLayout } from '../lib/column-layout'
import { CELL_DENSITY } from '../lib/constants'
import type {
  DataGridFeatures,
  DataGridTableMeta,
} from '../lib/data-grid-features'
import type { DataGridDensity } from '../types'

export interface DataGridBodyCellProps<TData extends RowData> {
  cell: Cell<DataGridFeatures, TData, unknown>
  columnIndex: number
  density: DataGridDensity
  interactions: CellInteractions
  isFocused: boolean
  isSelected: boolean
  layout: ColumnLayout | undefined
  rowSelected: boolean
  showFocus: boolean
  canSelect: boolean
  meta: DataGridTableMeta | undefined
}

function DataGridBodyCellView<TData extends RowData>({
  cell,
  columnIndex,
  density,
  interactions,
  isFocused,
  isSelected,
  layout,
  showFocus,
}: DataGridBodyCellProps<TData>) {
  const columnId = cell.column.id

  return (
    <div
      aria-colindex={columnIndex + 1}
      aria-selected={isSelected}
      className={cn(
        'flex min-w-0 items-center overflow-hidden border-e outline-none last:border-e-0 data-[pinned]:bg-background data-[selected=true]:bg-primary/10 data-[focused=true]:ring-1 data-[focused=true]:ring-inset data-[focused=true]:ring-ring',
        CELL_DENSITY[density],
      )}
      data-column-id={columnId}
      data-focused={showFocus ? 'true' : undefined}
      data-pinned={layout?.pinned || undefined}
      data-selected={isSelected ? 'true' : undefined}
      data-slot="data-grid-cell"
      onClick={interactions.onClick}
      onClickCapture={interactions.onClickCapture}
      onKeyDown={interactions.onKeyDown}
      onMouseDownCapture={interactions.onMouseDownCapture}
      onPointerDownCapture={interactions.onPointerDownCapture}
      role="gridcell"
      style={layout?.style}
      tabIndex={isFocused ? 0 : -1}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  )
}

export const DataGridBodyCell = memo(
  DataGridBodyCellView,
) as typeof DataGridBodyCellView
