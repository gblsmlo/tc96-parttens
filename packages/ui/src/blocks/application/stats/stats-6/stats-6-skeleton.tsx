import { Card } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { StatsSkeleton } from '../shared/stats-load-state'

export function Stats6Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <StatsSkeleton className="px-6 pb-6" label={label}>
      <div className="grid gap-4 md:grid-cols-3">
        {['a', 'b', 'c'].map((id) => (
          <Card key={id}>
            <div className="flex flex-col gap-3 p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    </StatsSkeleton>
  )
}
