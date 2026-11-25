// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ColumnLayouts } from '../lib/column-layout'
import { CELL_DENSITY, ROW_DENSITY, ROW_HEIGHT } from '../lib/constants'
import type { DataGridDensity } from '../types'

export interface DataGridRowSkeletonAnatomy {
  cell?: 'control' | 'text'
}

export interface DataGridSkeletonRowsProps {
  anatomy?: DataGridRowSkeletonAnatomy
  columnIds: readonly string[]
  columnLayouts: ColumnLayouts
  density: DataGridDensity
  headerRowCount: number
  loadingMore?: boolean
  rowIds: readonly string[]
  rowIndexOffset?: number
  virtualStart?: number
}

export function DataGridSkeletonRows({
  anatomy = {},
  columnIds,
  columnLayouts,
  density,
  headerRowCount,
  loadingMore,
  rowIds,
  rowIndexOffset = 0,
  virtualStart,
}: DataGridSkeletonRowsProps) {
  return rowIds.map((rowId, rowIndex) => (
    <div
      aria-rowindex={headerRowCount + rowIndexOffset + rowIndex + 1}
      className={cn(
        'flex w-full border-b last:border-b-0',
        ROW_DENSITY[density],
        virtualStart !== undefined && 'absolute start-0 top-0',
      )}
      data-cell={anatomy.cell ?? 'text'}
      data-loading-more={loadingMore ? 'true' : undefined}
      key={rowId}
      role="row"
      style={
        virtualStart === undefined
          ? undefined
          : {
              height: ROW_HEIGHT[density],
              transform: `translateY(${virtualStart + rowIndex * ROW_HEIGHT[density]}px)`,
            }
      }
      tabIndex={-1}
    >
      {columnIds.map((columnId, columnIndex) => {
        const layout = columnLayouts.get(columnId)
        return (
          <div
            aria-colindex={columnIndex + 1}
            className={cn(
              'flex items-center border-e last:border-e-0 data-[pinned]:bg-background',
              CELL_DENSITY[density],
            )}
            data-column-id={columnId}
            data-pinned={layout?.pinned || undefined}
            key={columnId}
            role="gridcell"
            style={layout?.style}
            tabIndex={-1}
          >
            <Skeleton
              className={cn(
                'w-full',
                anatomy.cell === 'control' ? 'h-6' : 'my-0.5 h-4',
              )}
            />
          </div>
        )
      })}
    </div>
  ))
}
