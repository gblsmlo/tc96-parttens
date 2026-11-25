import { Skeleton } from '@tc96/ui/skeleton'
import { GridLoadSkeleton } from '../../shared/grid/grid-load-state'

const groups = [
  { id: 'a', rows: ['a1', 'a2', 'a3'] },
  { id: 'b', rows: ['b1', 'b2'] },
]

export function Revenue3Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <GridLoadSkeleton className="grid gap-4" label={label}>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid gap-2 rounded-md border p-3">
        {groups.map((group) => (
          <div className="grid gap-2" key={group.id}>
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 py-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="ms-auto h-4 w-20" />
              <Skeleton className="ms-auto h-4 w-16" />
            </div>
            {group.rows.map((row) => (
              <div
                className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 py-1.5"
                key={row}
              >
                <div className="flex items-center gap-3 ps-6">
                  <Skeleton className="size-6 shrink-0 rounded-md" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-6 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="ms-auto h-4 w-20" />
                <Skeleton className="ms-auto h-4 w-12" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </GridLoadSkeleton>
  )
}
