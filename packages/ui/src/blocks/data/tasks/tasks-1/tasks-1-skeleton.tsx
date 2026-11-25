import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Tasks1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['task', 'title'],
        ['tags', 'badge'],
        ['due', 'text'],
        ['project', 'text'],
        ['assignees', 'avatar'],
        ['priority', 'badge'],
        ['updated', 'text'],
      ]}
      grid="grid-cols-[3.5fr_1.5fr_1.5fr_1.5fr_1.5fr_1.5fr_1.5fr]"
      label={label}
    />
  )
}
