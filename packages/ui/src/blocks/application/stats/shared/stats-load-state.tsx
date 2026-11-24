import { Button } from '@tc96/ui/button'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import type { StatsLoadLabels, StatsLoadProps } from './types'

export function StatsSkeleton({
  children,
  className,
  label,
}: Readonly<{ children: ReactNode; className?: string; label: string }>) {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className={cn('block', className)}
      data-slot="stats-skeleton"
    >
      {children}
    </output>
  )
}

export function statsLoadState({
  error,
  labels,
  onRetry,
  pending,
  skeleton,
}: Readonly<
  StatsLoadProps & { labels: StatsLoadLabels; skeleton: ReactNode }
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
