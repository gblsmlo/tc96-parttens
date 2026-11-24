'use client'

import { Skeleton } from '@tc96/ui/skeleton'
import { TableCell, TableRow } from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import { skeletonKeys } from '../../shared/lib/skeleton-keys'

export interface DataTableRowSkeletonAnatomy {
  cell?: 'control' | 'text'
  lines?: 1 | 2
}

export interface DataTableSkeletonRowsProps {
  anatomy: DataTableRowSkeletonAnatomy
  columnCount: number
  linesColumnIndex: number
  loadingMore?: boolean
  rowCount: number
  scope: string
}

export function DataTableSkeletonRows({
  anatomy,
  columnCount,
  linesColumnIndex,
  loadingMore = false,
  rowCount,
  scope,
}: DataTableSkeletonRowsProps) {
  return skeletonKeys(scope, rowCount).map((rowKey) => (
    <TableRow
      data-cell={anatomy.cell ?? 'text'}
      data-lines={anatomy.lines ?? 1}
      data-loading-more={loadingMore ? 'true' : undefined}
      key={rowKey}
    >
      {skeletonKeys(rowKey, columnCount).map((cellKey, index) => (
        <TableCell key={cellKey}>
          {index === linesColumnIndex && anatomy.lines === 2 ? (
            <div className="flex min-w-4 flex-col">
              <Skeleton className="my-0.5 h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ) : (
            <Skeleton
              className={cn(
                'min-w-4 w-full',
                anatomy.cell === 'control' ? 'h-6' : 'my-0.5 h-4',
              )}
            />
          )}
        </TableCell>
      ))}
    </TableRow>
  ))
}
