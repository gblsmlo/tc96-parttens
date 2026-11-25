import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'

export function Legal9Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <DataCollectionRowsSkeleton
      cells={[
        ['title', 'text'],
        ['holder', 'text'],
        ['billingModel', 'text'],
        ['status', 'badge'],
        ['amount', 'text'],
        ['owner', 'avatar'],
      ]}
      grid="grid-cols-[3fr_2fr_1.5fr_1.5fr_1.5fr_2fr]"
      label={label}
    />
  )
}
