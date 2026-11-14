'use client'

import { Button } from '@tc96/ui/button'
import { MenuTrigger } from '@tc96/ui/menu'
import { cva } from 'class-variance-authority'
import { ChevronDownIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import type {
  DataTableAggregation,
  DataTableAggregationLabels,
} from './data-table-aggregation'

const triggerVariants = cva('group/aggregation -mx-2 font-normal', {
  variants: {
    empty: {
      false: '',
      true: 'opacity-0 focus-visible:opacity-100 data-popup-open:opacity-100 group-focus-within/footer:opacity-100 group-hover/footer:opacity-100 pointer-coarse:opacity-100',
    },
  },
})

export function DataTableAggregationTrigger({
  labels,
  result,
  value,
}: Readonly<{
  labels: DataTableAggregationLabels
  result: ReactNode
  value: DataTableAggregation | null
}>): ReactElement {
  const empty = value === null

  return (
    <MenuTrigger
      render={
        <Button
          className={triggerVariants({ empty })}
          size="xs"
          variant="ghost"
        />
      }
    >
      <span className="text-muted-foreground group-hover/aggregation:text-accent-foreground/72 group-data-pressed/aggregation:text-accent-foreground/72">
        {empty ? labels.trigger : labels[value]}
      </span>
      {empty ? null : (
        <>
          {' '}
          <span className="font-medium tabular-nums">{result}</span>
        </>
      )}
      <ChevronDownIcon aria-hidden="true" />
    </MenuTrigger>
  )
}
