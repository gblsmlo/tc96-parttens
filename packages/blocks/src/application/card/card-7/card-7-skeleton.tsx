import { Card, CardPanel } from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import { CardSkeleton } from '../shared/card-load-state'

export function Card7Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <CardSkeleton label={label}>
      <Card>
        <CardPanel className="grid gap-5 p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
          {['a', 'b', 'c'].map((id) => (
            <Skeleton className="h-9 w-full" key={id} />
          ))}
          <Skeleton className="h-9 w-full" />
        </CardPanel>
      </Card>
    </CardSkeleton>
  )
}
