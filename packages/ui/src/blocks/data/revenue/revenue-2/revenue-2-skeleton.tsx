import { Skeleton } from '@tc96/ui/skeleton'
import { TableLoadSkeleton } from '../../shared/table/table-load-state'

const rows = ['a', 'b', 'c', 'd', 'e', 'f']
const columns = [
  'select',
  'account',
  'renewal',
  'arr',
  'health',
  'stage',
  'risk',
]
const grid = 'grid grid-cols-[1.5rem_3fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] gap-4'

export function Revenue2Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <TableLoadSkeleton className="grid gap-4" label={label}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid gap-2 rounded-md border">
        <div className={`${grid} border-b p-3`}>
          {columns.map((id) => (
            <Skeleton className="h-3.5 w-full max-w-20" key={id} />
          ))}
        </div>
        {rows.map((id) => (
          <div className={`${grid} items-center px-3 py-2`} key={id}>
            <Skeleton className="size-4 rounded-sm" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-lg" />
              <div className="grid gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="grid gap-1.5">
              <Skeleton className="h-1.5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-5 w-28 rounded-sm" />
            <Skeleton className="h-5 w-14 rounded-sm" />
          </div>
        ))}
      </div>
    </TableLoadSkeleton>
  )
}
