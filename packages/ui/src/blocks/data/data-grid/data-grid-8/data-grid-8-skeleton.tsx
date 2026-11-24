import { Skeleton } from '@tc96/ui/skeleton'
import { GridLoadSkeleton } from '../shared/grid-load-state'

const rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const grid =
  'grid grid-cols-[1.2fr_1.8fr_1fr_1fr] items-center gap-4 sm:grid-cols-[1.2fr_1.8fr_1fr_1fr_1.2fr_0.8fr]'

export function DataGrid8Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <GridLoadSkeleton className="grid gap-4" label={label}>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid gap-2 rounded-md border">
        <div className={`${grid} border-b p-3`}>
          {['transaction', 'customer', 'amount', 'status'].map((id) => (
            <Skeleton className="h-3.5 w-16" key={id} />
          ))}
          <Skeleton className="hidden h-3.5 w-16 sm:block" />
          <Skeleton className="hidden h-3.5 w-12 sm:block" />
        </div>
        {rows.map((id) => (
          <div className={`${grid} px-3 py-2`} key={id}>
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="grid gap-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="ms-auto h-4 w-20" />
            <Skeleton className="h-5 w-20 rounded-sm" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="hidden h-4 w-10 sm:block" />
          </div>
        ))}
      </div>
    </GridLoadSkeleton>
  )
}
