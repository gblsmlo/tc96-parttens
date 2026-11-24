import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Button } from '@tc96/ui/button'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import type { CardLoadLabels, CardLoadProps } from './types'

export function CardSkeleton({
  children,
  className,
  label,
}: Readonly<{ children: ReactNode; className?: string; label: string }>) {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className={cn('block', className)}
      data-slot="card-skeleton"
    >
      {children}
    </output>
  )
}

export function cardLoadState({
  error,
  labels,
  onRetry,
  pending,
  skeleton,
}: Readonly<
  CardLoadProps & { labels: CardLoadLabels; skeleton: ReactNode }
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
