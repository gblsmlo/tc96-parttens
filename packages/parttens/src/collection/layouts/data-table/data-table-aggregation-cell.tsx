'use client'

import { Menu, MenuPopup, MenuRadioGroup, MenuRadioItem } from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import type { ReactElement, ReactNode } from 'react'
import type {
  DataTableAggregation,
  DataTableAggregationLabels,
} from './data-table-aggregation'
import { DataTableAggregationTrigger } from './data-table-aggregation-trigger'

const NONE = '__none__'

const isAggregation = (
  value: unknown,
  options: readonly DataTableAggregation[],
): value is DataTableAggregation =>
  options.includes(value as DataTableAggregation)

export function DataTableAggregationCell({
  align = 'start',
  labels,
  onValueChange,
  options,
  result,
  value,
}: Readonly<{
  align?: 'end' | 'start'
  labels: DataTableAggregationLabels
  onValueChange: (value: DataTableAggregation | null) => void
  options: readonly DataTableAggregation[]
  result: ReactNode
  value: DataTableAggregation | null
}>): ReactElement {
  return (
    <div
      className={cn('flex', align === 'end' && 'justify-end')}
      data-aggregation={value ?? undefined}
      data-slot="data-table-aggregation"
    >
      <Menu>
        <DataTableAggregationTrigger
          labels={labels}
          result={result}
          value={value}
        />
        <MenuPopup align={align}>
          <MenuRadioGroup
            onValueChange={(next) =>
              onValueChange(isAggregation(next, options) ? next : null)
            }
            value={value ?? NONE}
          >
            <MenuRadioItem value={NONE}>{labels.none}</MenuRadioItem>
            {options.map((option) => (
              <MenuRadioItem key={option} value={option}>
                {labels[option]}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuPopup>
      </Menu>
    </div>
  )
}
