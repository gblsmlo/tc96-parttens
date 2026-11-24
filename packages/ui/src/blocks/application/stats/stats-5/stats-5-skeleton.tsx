import { Skeleton } from '@tc96/ui/skeleton'
import { StatsSkeleton } from '../shared/stats-load-state'

export function Stats5Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <StatsSkeleton label={label}>
      <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {['a', 'b', 'c'].map((id) => (
          <div className="flex flex-col gap-3 p-6" key={id}>
            <Skeleton className="h-4 w-28" />
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </StatsSkeleton>
  )
}
