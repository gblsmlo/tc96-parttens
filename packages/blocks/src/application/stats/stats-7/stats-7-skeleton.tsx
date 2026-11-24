import { Card } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { StatsSkeleton } from '../shared/stats-load-state'

export function Stats7Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <StatsSkeleton label={label}>
      <div className="grid gap-4 md:grid-cols-3">
        {['a', 'b', 'c'].map((id) => (
          <Card key={id}>
            <div className="grid gap-4 p-5">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-end justify-between gap-4">
                <div className="grid gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-24" />
                </div>
                <Skeleton className="h-12 w-1/2 max-w-40" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StatsSkeleton>
  )
}
