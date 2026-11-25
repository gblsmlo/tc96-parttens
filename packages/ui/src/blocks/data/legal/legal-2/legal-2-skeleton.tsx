import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Legal2Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['contract', 'title'],
        ['parties', 'text'],
        ['value', 'text'],
        ['term', 'text'],
        ['owner', 'avatar'],
        ['queue', 'badge'],
        ['status', 'badge'],
      ]}
      grid="grid-cols-[3fr_2fr_1fr_1.5fr_1fr_1.5fr_1.5fr]"
      label={label}
    />
  )
}
