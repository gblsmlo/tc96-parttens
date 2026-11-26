import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Finance4Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['description', 'title'],
        ['client', 'text'],
        ['responsible', 'avatar'],
        ['due', 'text'],
        ['amount', 'text'],
        ['situation', 'badge'],
      ]}
      grid="grid-cols-[3fr_1.5fr_1.5fr_1fr_1fr_1fr]"
      label={label}
    />
  )
}
