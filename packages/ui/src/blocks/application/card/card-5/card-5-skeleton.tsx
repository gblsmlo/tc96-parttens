import { Card } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { CardSkeleton } from '../shared/card-load-state'

export function Card5Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <CardSkeleton label={label}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {['a', 'b', 'c', 'd'].map((id) => (
          <Card key={id}>
            <div className="flex flex-col gap-3 p-5">
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </CardSkeleton>
  )
}
