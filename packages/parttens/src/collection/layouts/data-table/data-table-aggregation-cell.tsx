'use client'

import { Menu, MenuPopup, MenuRadioGroup } from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import type { ReactElement, ReactNode } from 'react'
import { MenuRadioOption } from '../../../shared/components/menu-selection-item'
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
            <MenuRadioOption value={NONE}>{labels.none}</MenuRadioOption>
            {options.map((option) => (
              <MenuRadioOption key={option} value={option}>
                {labels[option]}
              </MenuRadioOption>
            ))}
          </MenuRadioGroup>
        </MenuPopup>
      </Menu>
    </div>
  )
}
