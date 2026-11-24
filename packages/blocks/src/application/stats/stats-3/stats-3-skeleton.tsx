import { Skeleton } from '@tc96/ui/skeleton'
import { StatsSkeleton } from '../shared/stats-load-state'

export function Stats3Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <StatsSkeleton label={label}>
      <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {['a', 'b', 'c'].map((id) => (
          <div className="flex flex-col gap-3 p-6" key={id}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </StatsSkeleton>
  )
}
