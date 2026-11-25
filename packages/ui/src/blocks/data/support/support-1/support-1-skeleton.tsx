import { Skeleton } from '@tc96/ui/skeleton'
import { GridLoadSkeleton } from '../../shared/grid/grid-load-state'

const rows = ['a', 'b', 'c', 'd', 'e', 'f']
const grid = 'grid grid-cols-[1.5rem_3fr_2fr_1fr_1fr_1.5fr_1fr] gap-4'

export function Support1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <GridLoadSkeleton className="grid gap-4" label={label}>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="grid gap-2 rounded-md border">
        <div className={`${grid} border-b p-3`}>
          {[
            'select',
            'ticket',
            'requester',
            'queue',
            'priority',
            'sla',
            'status',
          ].map((id) => (
            <Skeleton className="h-3.5 w-full max-w-20" key={id} />
          ))}
        </div>
        {rows.map((id) => (
          <div className={`${grid} items-center px-3 py-2`} key={id}>
            <Skeleton className="size-4 rounded-sm" />
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-full max-w-72" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <div className="grid gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-sm" />
            <Skeleton className="h-5 w-14 rounded-sm" />
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-16 rounded-sm" />
          </div>
        ))}
      </div>
    </GridLoadSkeleton>
  )
}
