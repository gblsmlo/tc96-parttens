'use client'

import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import type { ReactElement } from 'react'

import type { WidgetPeriodOption } from '../types'
import { cn } from '@tc96/utils'

export interface WidgetPeriodToggleProps<TPeriod extends string = string> {
  'aria-label'?: string
  className?: string
  onValueChange?: (period: TPeriod) => void
  options: readonly WidgetPeriodOption<TPeriod>[]
  value?: TPeriod
}

export function WidgetPeriodToggle<TPeriod extends string = string>({
  'aria-label': ariaLabel = 'Período',
  className,
  onValueChange,
  options,
  value,
}: Readonly<WidgetPeriodToggleProps<TPeriod>>): ReactElement {
  return (
    <ToggleGroup
      aria-label={ariaLabel}
      className={className}
      data-slot="widget-period-toggle"
      onValueChange={(next) => {
        const [period] = next as TPeriod[]
        if (period) onValueChange?.(period)
      }}
      size="default"
      value={value === undefined ? [] : [value]}
      variant="default"
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
