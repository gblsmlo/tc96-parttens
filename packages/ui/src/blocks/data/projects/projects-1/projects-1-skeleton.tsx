import { Skeleton } from '@tc96/ui/skeleton'
import { GridLoadSkeleton } from '../../shared/grid/grid-load-state'

const tabs = ['all', 'active', 'backlog']
const rows = ['a', 'b', 'c', 'd', 'e']

export function Projects1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <GridLoadSkeleton className="grid gap-4" label={label}>
      <div className="flex items-center gap-4 border-b pb-2">
        {tabs.map((id) => (
          <Skeleton className="h-5 w-20" key={id} />
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid gap-2 rounded-md border p-3">
        {rows.map((id) => (
          <div
            className="grid grid-cols-[3fr_1fr_1.25fr_1fr_1fr] items-center gap-4 py-1.5"
            key={id}
          >
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-56 max-w-full" />
            </div>
            <Skeleton className="h-5 w-20 rounded-sm" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-5 w-14 rounded-sm" />
            <Skeleton className="h-5 w-24 rounded-sm" />
          </div>
        ))}
      </div>
    </GridLoadSkeleton>
  )
}
