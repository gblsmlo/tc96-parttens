import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Tasks3Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['title', 'title'],
        ['due', 'text'],
        ['project', 'text'],
        ['assignees', 'avatar'],
        ['updated', 'text'],
      ]}
      grid="grid-cols-[3fr_1fr_1.5fr_1.5fr_1fr]"
      label={label}
    />
  )
}
