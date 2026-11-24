import { ListRowsSkeleton, ListSkeleton } from '../shared/list-load-state'

export function List1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <ListSkeleton label={label}>
      <ListRowsSkeleton count={4} end="amount" />
    </ListSkeleton>
  )
}
