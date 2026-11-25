import { DataCollectionRowsSkeleton } from '../../shared/collection/data-collection-load-state'
import type { Crm1Variant } from './types'

export function Crm1Skeleton({
  label,
  variant,
}: Readonly<{ label: string; variant: Crm1Variant }>) {
  return variant === 'people' ? (
    <DataCollectionRowsSkeleton
      cells={[
        ['name', 'title'],
        ['email', 'text'],
        ['phone', 'text'],
        ['document', 'text'],
        ['tags', 'badge'],
      ]}
      grid="grid-cols-[2.5fr_2.5fr_2fr_2fr_2fr]"
      label={label}
    />
  ) : (
    <DataCollectionRowsSkeleton
      cells={[
        ['name', 'title'],
        ['phone', 'text'],
        ['document', 'text'],
        ['sector', 'badge'],
        ['tags', 'badge'],
      ]}
      grid="grid-cols-[2.5fr_2fr_2fr_1.5fr_2fr]"
      label={label}
    />
  )
}
