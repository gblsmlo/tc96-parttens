import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import { TimelineList } from '../shared/timeline-list'
import { TimelineSkeletonItem } from '../shared/timeline-skeleton-item'

function SkeletonRelease({ last }: Readonly<{ last?: boolean }>) {
  return (
    <TimelineSkeletonItem last={last}>
      <div className="grid gap-3 pt-1 sm:grid-cols-[7rem_1fr]">
        <Skeleton className="h-4 w-20" />
        <div className="grid gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </TimelineSkeletonItem>
  )
}

export function Timeline2Skeleton({
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
        <SkeletonRelease />
        <SkeletonRelease last />
      </TimelineList>
    </section>
  )
}
