import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Legal5Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['title', 'text'],
        ['number', 'badge'],
        ['phase', 'text'],
        ['deadline', 'text'],
        ['clients', 'avatar'],
        ['owner', 'avatar'],
        ['tags', 'badge'],
      ]}
      grid="grid-cols-[3fr_2fr_1.5fr_1.5fr_2fr_1.5fr_1.5fr]"
      label={label}
    />
  )
}
