import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'

export interface CalendarItemSkeletonProps {
  className?: string
  display?: 'block' | 'chip'
  label?: string
}

export function CalendarItemSkeleton({
  className,
  display = 'chip',
  label = 'Carregando compromisso',
}: CalendarItemSkeletonProps): ReactElement {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className={cn(
        'pointer-events-none flex min-w-0 select-none gap-1 overflow-hidden rounded-md border-s-2 border-s-muted-foreground/20 bg-muted/40',
        display === 'block'
          ? 'h-full w-full flex-col px-2 py-1'
          : 'px-1.5 py-0.5',
        className,
      )}
      data-slot="calendar-item-skeleton"
    >
      <Skeleton aria-hidden="true" className="h-3 w-8 shrink-0" />
      <Skeleton aria-hidden="true" className="h-3 w-2/3" />
    </output>
  )
}
