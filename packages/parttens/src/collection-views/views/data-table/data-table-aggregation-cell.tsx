'use client'

import { Button } from '@tc96/ui/button'
import { Menu, MenuPopup, MenuRadioGroup, MenuTrigger } from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import { ChevronDownIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { MenuRadioOption } from '../../../shared/components/menu-selection-item'
import type {
  DataTableAggregation,
  DataTableAggregationLabels,
} from './data-table-aggregation'

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
        <MenuTrigger
          render={
            <Button
              className={cn(
                '-mx-2 font-normal',
                value === null &&
                  'opacity-0 focus-visible:opacity-100 data-popup-open:opacity-100 group-focus-within/footer:opacity-100 group-hover/footer:opacity-100 pointer-coarse:opacity-100',
              )}
              size="xs"
              variant="ghost"
            />
          }
        >
          {value === null ? (
            <span className="text-muted-foreground">{labels.trigger}</span>
          ) : (
            <>
              <span className="text-muted-foreground">{labels[value]}</span>{' '}
              <span className="font-medium tabular-nums">{result}</span>
            </>
          )}
          <ChevronDownIcon aria-hidden="true" />
        </MenuTrigger>
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
