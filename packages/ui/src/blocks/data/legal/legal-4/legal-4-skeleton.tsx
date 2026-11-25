import { LegalRowsSkeleton } from '../shared/legal-load-state'

export function Legal4Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <LegalRowsSkeleton
      cells={{
        cases: 'text',
        client: 'title',
        contact: 'title',
        owner: 'avatar',
        queue: 'badge',
        since: 'text',
        status: 'badge',
      }}
      grid="grid-cols-[1fr_2.5fr_2.5fr_1.5fr_1.5fr_1fr_1.5fr]"
      label={label}
    />
  )
}
