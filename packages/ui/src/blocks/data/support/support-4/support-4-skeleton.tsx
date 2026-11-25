import { Skeleton } from '@tc96/ui/skeleton'
import { TableLoadSkeleton } from '../../shared/table/table-load-state'

const rows = ['a', 'b', 'c', 'd', 'e', 'f']

export function Support4Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <TableLoadSkeleton
      className="grid gap-2 rounded-md border p-3"
      label={label}
    >
      {rows.map((id) => (
        <div
          className="grid grid-cols-[1.5rem_1.5rem_2fr_1fr_1.5fr_1.5fr_1fr_2.5rem] items-center gap-4 py-1.5"
          key={id}
        >
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-4" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-lg" />
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-sm" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-8 rounded-full" />
        </div>
      ))}
    </TableLoadSkeleton>
  )
}
