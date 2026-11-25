import {
  DataCollectionRowsSkeleton,
  type DataCollectionSkeletonColumns,
} from '../../shared/collection/data-collection-load-state'
import type { Finance3Variant } from './types'

const skeletons: Record<
  Finance3Variant,
  { cells: DataCollectionSkeletonColumns; grid: string }
> = {
  clientMoney: {
    cells: [
      ['name', 'text'],
      ['amount', 'text'],
    ],
    grid: 'grid-cols-[3fr_1fr]',
  },
  entries: {
    cells: [
      ['description', 'text'],
      ['kind', 'badge'],
      ['payer', 'text'],
      ['target', 'text'],
      ['due', 'text'],
      ['amount', 'text'],
      ['situation', 'badge'],
    ],
    grid: 'grid-cols-[3fr_1.5fr_2fr_2fr_1.5fr_1.5fr_1.5fr]',
  },
  receivables: {
    cells: [
      ['payer', 'text'],
      ['installment', 'text'],
      ['amount', 'text'],
      ['due', 'text'],
      ['lastContact', 'text'],
      ['charge', 'badge'],
    ],
    grid: 'grid-cols-[2fr_2fr_1.5fr_1.5fr_1.5fr_1.5fr]',
  },
  statement: {
    cells: [
      ['day', 'text'],
      ['description', 'text'],
      ['kind', 'text'],
      ['category', 'text'],
      ['amount', 'text'],
      ['balance', 'text'],
    ],
    grid: 'grid-cols-[1fr_3fr_1.5fr_1.5fr_1.5fr_1.5fr]',
  },
}

export function Finance3Skeleton({
  label,
  variant,
}: Readonly<{ label: string; variant: Finance3Variant }>) {
  const { cells, grid } = skeletons[variant]
  return <DataCollectionRowsSkeleton cells={cells} grid={grid} label={label} />
}
