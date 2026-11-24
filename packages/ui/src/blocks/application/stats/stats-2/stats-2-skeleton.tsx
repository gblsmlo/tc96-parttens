import { Skeleton } from '@tc96/ui/skeleton'
import { StatsSkeleton } from '../shared/stats-load-state'

export function Stats2Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <StatsSkeleton className="grid gap-5 px-6 pb-6" label={label}>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-28" />
      </div>
    </StatsSkeleton>
  )
}
