import { Skeleton } from '@tc96/ui/skeleton'
import { StatsSkeleton } from '../shared/stats-load-state'

export function Stats4Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <StatsSkeleton className="grid gap-6 px-6 pb-6" label={label}>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full rounded-full" />
        {['a', 'b', 'c', 'd'].map((id) => (
          <div className="flex items-center justify-between gap-3" key={id}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </StatsSkeleton>
  )
}
