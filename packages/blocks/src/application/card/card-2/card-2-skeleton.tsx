import { Card } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { CardSkeleton } from '../shared/card-load-state'

export function Card2Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <CardSkeleton label={label}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['a', 'b', 'c'].map((id) => (
          <Card key={id}>
            <div className="flex flex-col gap-4 p-5">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </CardSkeleton>
  )
}
