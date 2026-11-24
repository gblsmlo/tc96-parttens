import { Skeleton } from '@tc96/ui/skeleton'
import { GridLoadSkeleton } from '../shared/grid-load-state'

const kpis = ['a', 'b', 'c', 'd', 'e', 'f']
const rows = ['a', 'b', 'c', 'd', 'e', 'f']

export function DataGrid9Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <GridLoadSkeleton className="grid gap-4" label={label}>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((id) => (
          <div className="grid gap-2 bg-background p-4" key={id}>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid gap-2 rounded-md border p-3">
        {rows.map((id) => (
          <div
            className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 py-1.5"
            key={id}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-lg" />
              <div className="grid gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-sm" />
            <Skeleton className="ms-auto h-4 w-20" />
            <Skeleton className="ms-auto h-4 w-14" />
          </div>
        ))}
      </div>
    </GridLoadSkeleton>
  )
}
