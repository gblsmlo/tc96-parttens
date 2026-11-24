import { Button } from '@tc96/ui/button'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import type { GridLoadLabels, GridLoadProps } from './types'

export function GridLoadSkeleton({
  children,
  className,
  label,
}: Readonly<{ children: ReactNode; className?: string; label: string }>) {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className={cn('block', className)}
      data-slot="table-skeleton"
    >
      {children}
    </output>
  )
}

export function gridLoadState({
  error,
  labels,
  onRetry,
  pending,
  skeleton,
}: Readonly<
  GridLoadProps & { labels: GridLoadLabels; skeleton: ReactNode }
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
