import { Card } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { CardSkeleton } from '../shared/card-load-state'

export function Card6Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <CardSkeleton label={label}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {['a', 'b', 'c'].map((id) => (
          <Card key={id}>
            <div className="grid gap-4 p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </CardSkeleton>
  )
}
