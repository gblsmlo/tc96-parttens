import { LegalRowsSkeleton } from '../shared/legal-load-state'

export function Legal2Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <LegalRowsSkeleton
      cells={{
        contract: 'title',
        owner: 'avatar',
        parties: 'text',
        queue: 'badge',
        status: 'badge',
        term: 'text',
        value: 'text',
      }}
      grid="grid-cols-[3fr_2fr_1fr_1.5fr_1fr_1.5fr_1.5fr]"
      label={label}
    />
  )
}
