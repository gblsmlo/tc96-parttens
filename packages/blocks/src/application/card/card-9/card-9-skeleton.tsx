import { Card, CardPanel } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { CardSkeleton } from '../shared/card-load-state'

export function Card9Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <CardSkeleton label={label}>
      <Card>
        <CardPanel className="grid gap-4 p-5">
          <Skeleton className="h-5 w-40" />
          {['a', 'b', 'c'].map((id) => (
            <Skeleton className="h-5 w-56" key={id} />
          ))}
          <Skeleton className="h-12 w-full" />
        </CardPanel>
      </Card>
    </CardSkeleton>
  )
}
