import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Legal1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['title', 'text'],
        ['number', 'badge'],
        ['client', 'text'],
        ['phase', 'text'],
        ['owner', 'avatar'],
        ['deadline', 'text'],
        ['queue', 'badge'],
        ['status', 'badge'],
      ]}
      grid="grid-cols-[3fr_2fr_2fr_1fr_1.5fr_1fr_1.5fr_1.5fr]"
      label={label}
    />
  )
}
