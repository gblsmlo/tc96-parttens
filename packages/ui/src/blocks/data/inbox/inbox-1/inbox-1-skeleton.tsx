import { Skeleton } from '@tc96/ui/skeleton'
import { DataCollectionLoadSkeleton } from '../../shared/collection/data-collection-load-state'

const rows = ['a', 'b', 'c', 'd', 'e', 'f']
const grid =
  'grid grid-cols-[1rem_1.5rem_3fr_1fr_2fr_1.5fr_1fr] items-center gap-4'
const headers = [
  'select',
  'read',
  'entry',
  'origin',
  'reason',
  'due',
  'received',
]

export function Inbox1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionLoadSkeleton label={label}>
      <div className="grid gap-2 rounded-md border">
        <div className={`${grid} border-b p-3`}>
          {headers.map((id) => (
            <Skeleton className="h-3.5 w-full max-w-20" key={id} />
          ))}
        </div>
        {rows.map((id) => (
          <div className={`${grid} px-3 py-2`} key={id}>
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="size-2.5 rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 shrink-0 rounded-lg" />
              <Skeleton className="h-4 w-full max-w-72" />
            </div>
            <Skeleton className="h-4 w-full max-w-24" />
            <Skeleton className="h-4 w-full max-w-40" />
            <Skeleton className="h-4 w-full max-w-32" />
            <Skeleton className="h-3 w-full max-w-20" />
          </div>
        ))}
      </div>
    </DataCollectionLoadSkeleton>
  )
}
