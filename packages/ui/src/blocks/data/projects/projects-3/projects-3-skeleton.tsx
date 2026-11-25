import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Projects3Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['title', 'title'],
        ['type', 'text'],
        ['priority', 'badge'],
        ['status', 'badge'],
        ['start', 'text'],
        ['due', 'text'],
        ['assignee', 'avatar'],
        ['tags', 'badge'],
      ]}
      grid="grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1fr_1fr_1.5fr_1.5fr]"
      label={label}
    />
  )
}
