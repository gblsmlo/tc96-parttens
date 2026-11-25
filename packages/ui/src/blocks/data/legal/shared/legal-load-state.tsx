import { Button } from '@tc96/ui/button'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import type { LegalLoadLabels, LegalLoadProps } from './types'

export function LegalLoadSkeleton({
  children,
  className,
  label,
}: Readonly<{ children: ReactNode; className?: string; label: string }>) {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className={cn('block', className)}
      data-slot="legal-skeleton"
    >
      {children}
    </output>
  )
}

export type LegalSkeletonCell = 'avatar' | 'badge' | 'text' | 'title'

const skeletonRows = ['a', 'b', 'c', 'd', 'e', 'f']

export function LegalRowsSkeleton({
  cells,
  grid,
  label,
}: Readonly<{
  cells: Readonly<Record<string, LegalSkeletonCell>>
  grid: string
  label: string
}>) {
  const entries = Object.entries(cells)

  return (
    <LegalLoadSkeleton label={label}>
      <div className="grid gap-2 rounded-md border">
        <div className={cn('grid gap-4 border-b p-3', grid)}>
          {entries.map(([id]) => (
            <Skeleton className="h-3.5 w-full max-w-20" key={id} />
          ))}
        </div>
        {skeletonRows.map((row) => (
          <div
            className={cn('grid items-center gap-4 px-3 py-2', grid)}
            key={row}
          >
            {entries.map(([id, cell]) => (
              <LegalSkeletonCellShape cell={cell} key={id} />
            ))}
          </div>
        ))}
      </div>
    </LegalLoadSkeleton>
  )
}

function LegalSkeletonCellShape({
  cell,
}: Readonly<{ cell: LegalSkeletonCell }>) {
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

export function legalLoadState({
  error,
  labels,
  onRetry,
  pending,
  skeleton,
}: Readonly<
  LegalLoadProps & { labels: LegalLoadLabels; skeleton: ReactNode }
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
