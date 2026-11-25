import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Documents1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['name', 'title'],
        ['type', 'badge'],
        ['linkedTo', 'text'],
        ['access', 'badge'],
        ['createdBy', 'avatar'],
        ['createdAt', 'text'],
        ['size', 'text'],
      ]}
      grid="grid-cols-[3fr_1.5fr_2fr_1.5fr_1.5fr_1fr_1fr]"
      label={label}
    />
  )
}
