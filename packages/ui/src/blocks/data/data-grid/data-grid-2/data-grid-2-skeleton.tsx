import { Skeleton } from '@tc96/ui/skeleton'
import { GridLoadSkeleton } from '../shared/grid-load-state'

const rows = ['a', 'b', 'c', 'd', 'e', 'f']

export function DataGrid2Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <GridLoadSkeleton className="grid gap-2 rounded-md border" label={label}>
      <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] gap-4 border-b p-3">
        {['member', 'role', 'team', 'rating'].map((id) => (
          <Skeleton className="h-3.5 w-20" key={id} />
        ))}
      </div>
      {rows.map((id) => (
        <div
          className="grid grid-cols-[2fr_1fr_1.5fr_1fr] items-center gap-4 px-3 py-2"
          key={id}
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-sm" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </GridLoadSkeleton>
  )
}
