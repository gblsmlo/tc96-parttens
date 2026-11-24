import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Button } from '@tc96/ui/button'
import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import type { ListLoadLabels, ListLoadProps } from './types'

export function ListSkeleton({
  children,
  className,
  label,
}: Readonly<{ children: ReactNode; className?: string; label: string }>) {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className={cn('block', className)}
      data-slot="list-skeleton"
    >
      {children}
    </output>
  )
}

export function listLoadState({
  error,
  labels,
  onRetry,
  pending,
  skeleton,
}: Readonly<
  ListLoadProps & { labels: ListLoadLabels; skeleton: ReactNode }
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

export function ListRowsSkeleton({
  count,
  end,
}: Readonly<{ count: number; end: 'amount' | 'button' | 'icon' }>) {
  return (
    <div className="grid gap-2">
      {Array.from({ length: count }, (_, index) => `row-${index}`).map((id) => (
        <div
          className="flex items-center gap-3 rounded-lg border px-3 py-3"
          key={id}
        >
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-36 max-w-full" />
            <Skeleton className="h-3.5 w-52 max-w-full" />
          </div>
          {end === 'amount' ? <Skeleton className="h-4 w-20 shrink-0" /> : null}
          {end === 'button' ? <Skeleton className="h-8 w-24 shrink-0" /> : null}
          {end === 'icon' ? <Skeleton className="size-8 shrink-0" /> : null}
        </div>
      ))}
    </div>
  )
}
