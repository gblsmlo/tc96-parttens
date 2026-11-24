import { Skeleton } from '@tc96/ui/skeleton'
import { CardSkeleton } from '../shared/card-load-state'

export function Card1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <CardSkeleton className="p-5" label={label}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {['a', 'b', 'c', 'd', 'e', 'f'].map((id) => (
          <div className="grid gap-2 rounded-lg bg-muted/50 p-4" key={id}>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>
    </CardSkeleton>
  )
}
