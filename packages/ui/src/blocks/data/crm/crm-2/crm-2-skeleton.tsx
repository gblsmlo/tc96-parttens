import { Skeleton } from '@tc96/ui/skeleton'
import {
  DataCollectionLoadSkeleton,
  DataCollectionRowsSkeleton,
} from '../../shared/collection/data-collection-load-state'
import type { Crm2Mode } from './types'

const boardColumns = ['a', 'b', 'c', 'd']
const boardCards = ['a', 'b']

export function Crm2Skeleton({
  label,
  mode,
}: Readonly<{ label: string; mode: Crm2Mode }>) {
  if (mode === 'table')
    return (
      <DataCollectionRowsSkeleton
        cells={[
          ['title', 'text'],
          ['contact', 'text'],
          ['stage', 'badge'],
          ['origin', 'text'],
          ['owner', 'avatar'],
          ['value', 'text'],
          ['nextAction', 'text'],
          ['nextActionAt', 'text'],
          ['tags', 'badge'],
        ]}
        grid="grid-cols-[3fr_2fr_1.5fr_1.5fr_1.5fr_1fr_2fr_1fr_1.5fr]"
        label={label}
      />
    )
  return (
    <DataCollectionLoadSkeleton label={label}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {boardColumns.map((column) => (
          <div className="grid content-start gap-3" key={column}>
            <Skeleton className="h-4 w-28" />
            {boardCards.map((card) => (
              <div className="grid gap-2 rounded-md border p-3" key={card}>
                <Skeleton className="h-4 w-full max-w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </DataCollectionLoadSkeleton>
  )
}
