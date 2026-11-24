import { Skeleton } from '@tc96/ui/skeleton'
import { ListSkeleton } from '../shared/list-load-state'

export function List6Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <ListSkeleton className="grid gap-2" label={label}>
      <div className="grid grid-cols-4 gap-4 border-b py-2">
        {['name', 'status', 'price', 'change'].map((id) => (
          <Skeleton className="h-3.5 w-16" key={id} />
        ))}
      </div>
      {['a', 'b', 'c', 'd', 'e'].map((id) => (
        <div className="grid grid-cols-4 items-center gap-4 py-2" key={id}>
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 shrink-0 rounded-md" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="ms-auto h-4 w-20" />
          <Skeleton className="ms-auto h-4 w-14" />
        </div>
      ))}
    </ListSkeleton>
  )
}
