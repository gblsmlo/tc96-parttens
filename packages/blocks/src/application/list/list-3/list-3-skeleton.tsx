import { ListRowsSkeleton, ListSkeleton } from '../shared/list-load-state'

export function List3Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <ListSkeleton label={label}>
      <ListRowsSkeleton count={5} end="amount" />
    </ListSkeleton>
  )
}
