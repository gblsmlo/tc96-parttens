import { LegalRowsSkeleton } from '../shared/legal-load-state'

export function Legal3Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <LegalRowsSkeleton
      cells={{
        case: 'title',
        deadline: 'title',
        due: 'text',
        owner: 'avatar',
        queue: 'badge',
        status: 'badge',
      }}
      grid="grid-cols-[2.5fr_2.5fr_1fr_1.5fr_1.5fr_1.5fr]"
      label={label}
    />
  )
}
