import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Documents4Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['name', 'title'],
        ['type', 'text'],
        ['owner', 'avatar'],
        ['updated', 'text'],
        ['size', 'text'],
      ]}
      grid="grid-cols-[3fr_1fr_1.5fr_1fr_1fr]"
      label={label}
    />
  )
}
