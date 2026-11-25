import { Button } from '@tc96/ui/button'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import type { DataCollectionLoadLabels, DataCollectionLoadProps } from './types'

export function DataCollectionLoadSkeleton({
  children,
  className,
  label,
}: Readonly<{ children: ReactNode; className?: string; label: string }>) {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className={cn('block', className)}
      data-slot="data-collection-skeleton"
    >
      {children}
    </output>
  )
}

export type DataCollectionSkeletonCell = 'avatar' | 'badge' | 'text' | 'title'

export type DataCollectionSkeletonColumns = readonly (readonly [
  id: string,
  cell: DataCollectionSkeletonCell,
])[]

const skeletonRows = ['a', 'b', 'c', 'd', 'e', 'f']

export function DataCollectionRowsSkeleton({
  cells,
  grid,
  label,
}: Readonly<{
  cells: DataCollectionSkeletonColumns
  grid: string
  label: string
}>) {
  return (
    <DataCollectionLoadSkeleton label={label}>
      <div className="grid gap-2 rounded-md border">
        <div className={cn('grid gap-4 border-b p-3', grid)}>
          {cells.map(([id]) => (
            <Skeleton className="h-3.5 w-full max-w-20" key={id} />
          ))}
        </div>
        {skeletonRows.map((row) => (
          <div
            className={cn('grid items-center gap-4 px-3 py-2', grid)}
            key={row}
          >
            {cells.map(([id, cell]) => (
              <DataCollectionSkeletonCellShape cell={cell} key={id} />
            ))}
          </div>
        ))}
      </div>
    </DataCollectionLoadSkeleton>
  )
}

function DataCollectionSkeletonCellShape({
  cell,
}: Readonly<{ cell: DataCollectionSkeletonCell }>) {
  if (cell === 'title')
    return (
      <div className="grid gap-1.5">
        <Skeleton className="h-4 w-full max-w-64" />
        <Skeleton className="h-3 w-40 max-w-full" />
      </div>
    )
  if (cell === 'avatar')
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    )
  if (cell === 'badge') return <Skeleton className="h-6 w-24 rounded-sm" />
  return <Skeleton className="h-4 w-full max-w-24" />
}

export function dataCollectionLoadState({
  error,
  labels,
  onRetry,
  pending,
  skeleton,
}: Readonly<
  DataCollectionLoadProps & {
    labels: DataCollectionLoadLabels
    skeleton: ReactNode
  }
>): ReactNode {
  if (pending) return skeleton
  if (error)
    return (
      <StateSurface
        actions={
          onRetry ? (
            <Button onClick={onRetry} size="sm" variant="outline">
              {labels.retry}
            </Button>
          ) : undefined
        }
        description={labels.errorDescription}
        kind="error"
        title={labels.errorTitle}
      />
    )
  return null
}
