import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'
import type { Legal8View } from './types'

export function Legal8Skeleton({
  label,
  view,
}: Readonly<{ label: string; view: Legal8View }>) {
  if (view === 'failures')
    return (
      <DataCollectionRowsSkeleton
        cells={[
          ['kind', 'text'],
          ['origin', 'text'],
          ['startedAt', 'text'],
          ['lastOccurredAt', 'text'],
          ['occurrences', 'text'],
          ['state', 'badge'],
        ]}
        grid="grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.5fr]"
        label={label}
      />
    )
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['kind', 'text'],
        ['startedAt', 'text'],
        ['finishedAt', 'text'],
        ['state', 'badge'],
        ['publications', 'text'],
        ['movements', 'text'],
        ['error', 'text'],
      ]}
      grid="grid-cols-[1.5fr_1fr_1fr_2fr_1fr_1fr_2fr]"
      label={label}
    />
  )
}
