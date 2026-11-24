import { Skeleton } from '@tc96/ui/skeleton'
import { TableLoadSkeleton } from '../shared/table-load-state'

const rows = ['a', 'b', 'c', 'd', 'e']

export function Table4Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <TableLoadSkeleton className="grid gap-4" label={label}>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid gap-2 rounded-md border p-3">
        {rows.map((id) => (
          <div
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 py-1.5"
            key={id}
          >
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ms-auto h-4 w-16" />
            <Skeleton className="ms-auto h-4 w-10" />
            <Skeleton className="h-5 w-16 rounded-sm" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-48" />
      </div>
    </TableLoadSkeleton>
  )
}
