import { Card, CardPanel } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { CardSkeleton } from '../shared/card-load-state'

export function Card8Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <CardSkeleton label={label}>
      <div className="grid gap-4 md:grid-cols-2">
        {['a', 'b'].map((id) => (
          <Card key={id}>
            <CardPanel className="grid gap-3 p-5">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-36" />
            </CardPanel>
          </Card>
        ))}
      </div>
    </CardSkeleton>
  )
}
