import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Legal4Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['client', 'title'],
        ['contact', 'title'],
        ['cases', 'text'],
        ['since', 'text'],
        ['owner', 'avatar'],
        ['queue', 'badge'],
        ['status', 'badge'],
      ]}
      grid="grid-cols-[2.5fr_2.5fr_1fr_1fr_1.5fr_1.5fr_1.5fr]"
      label={label}
    />
  )
}
