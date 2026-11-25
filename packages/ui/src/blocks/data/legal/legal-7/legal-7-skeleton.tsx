import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Legal7Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['availableOn', 'text'],
        ['tribunal', 'text'],
        ['kind', 'text'],
        ['number', 'text'],
        ['lawsuit', 'text'],
        ['lawyers', 'text'],
        ['excerpt', 'text'],
      ]}
      grid="grid-cols-[1.5fr_1fr_1fr_2fr_2fr_2fr_3fr]"
      label={label}
    />
  )
}
