import { Skeleton } from '@tc96/ui/skeleton'
import type { ReactNode } from 'react'
import { TimelineItem } from './timeline-item'

export interface TimelineSkeletonItemProps {
  children?: ReactNode
  last?: boolean
}

export function TimelineSkeletonItem({
  children,
  last,
}: Readonly<TimelineSkeletonItemProps>) {
  return (
    <TimelineItem
      last={last}
      marker={<Skeleton className="size-8 rounded-full" />}
    >
      {children ?? (
        <div className="grid gap-2 pt-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      )}
    </TimelineItem>
  )
}
