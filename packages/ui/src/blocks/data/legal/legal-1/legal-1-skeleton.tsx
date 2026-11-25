import { LegalRowsSkeleton } from '../shared/legal-load-state'

export function Legal1Skeleton({ label }: Readonly<{ label: string }>) {
  return (
    <LegalRowsSkeleton
      cells={{
        client: 'text',
        deadline: 'text',
        number: 'badge',
        owner: 'avatar',
        phase: 'text',
        queue: 'badge',
        status: 'badge',
        title: 'text',
      }}
      grid="grid-cols-[2fr_1fr_2fr_1.5fr_1fr_1.5fr_1.5fr_3fr]"
      label={label}
    />
  )
}
