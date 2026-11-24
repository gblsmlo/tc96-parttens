import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import { TimelineList } from '../shared/timeline-list'
import { TimelineSkeletonItem } from '../shared/timeline-skeleton-item'

export function Timeline1Skeleton({
  className,
  label,
  title,
}: Readonly<{ className?: string; label: string; title: string }>) {
  return (
    <section
      aria-busy="true"
      aria-label={label}
      className={cn('grid gap-4', className)}
    >
      <h3 className="font-medium text-base">{title}</h3>
      <TimelineList label={title}>
        <TimelineSkeletonItem />
        <TimelineSkeletonItem>
          <div className="grid gap-2 pt-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/5" />
            <Skeleton className="h-6 w-32" />
          </div>
        </TimelineSkeletonItem>
        <TimelineSkeletonItem last />
      </TimelineList>
    </section>
  )
}
