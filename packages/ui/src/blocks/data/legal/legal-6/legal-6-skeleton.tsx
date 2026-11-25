import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Legal6Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['deadline', 'title'],
        ['lawsuit', 'text'],
        ['client', 'text'],
        ['internalDate', 'text'],
        ['fatalDate', 'text'],
        ['daysLeft', 'text'],
        ['owner', 'avatar'],
      ]}
      grid="grid-cols-[2.5fr_2.5fr_2fr_1fr_1fr_1fr_1.5fr]"
      label={label}
    />
  )
}
