import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Agenda1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['title', 'title'],
        ['kind', 'badge'],
        ['when', 'text'],
        ['modality', 'badge'],
        ['location', 'text'],
        ['owner', 'avatar'],
      ]}
      grid="grid-cols-[3fr_1.5fr_2fr_1.5fr_2fr_1.5fr]"
      label={label}
    />
  )
}
