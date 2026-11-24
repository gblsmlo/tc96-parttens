import { Skeleton } from '@tc96/ui/skeleton'
import { CardSkeleton } from '../shared/card-load-state'

export function Card3Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <CardSkeleton className="grid gap-5 p-6" label={label}>
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-3 gap-2 border-t pt-4">
        {['a', 'b', 'c'].map((id) => (
          <div className="flex flex-col items-center gap-1" key={id}>
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </CardSkeleton>
  )
}
