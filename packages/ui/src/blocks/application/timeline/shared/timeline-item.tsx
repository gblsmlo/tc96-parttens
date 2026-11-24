import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'

export interface TimelineItemProps {
  children: ReactNode
  className?: string
  last?: boolean
  marker: ReactNode
}

export function TimelineItem({
  children,
  className,
  last = false,
  marker,
}: Readonly<TimelineItemProps>) {
  return (
    <li
      className={cn('flex gap-3', className)}
      data-last={last ? '' : undefined}
      data-slot="timeline-item"
    >
      <div
        className="flex shrink-0 flex-col items-center"
        data-slot="timeline-marker"
      >
        {marker}
        {last ? null : (
          <span
            aria-hidden="true"
            className="mt-1 w-px flex-1 bg-border"
            data-slot="timeline-connector"
          />
        )}
      </div>
      <div
        className={cn('min-w-0 flex-1', last ? '' : 'pb-6')}
        data-slot="timeline-content"
      >
        {children}
      </div>
    </li>
  )
}
