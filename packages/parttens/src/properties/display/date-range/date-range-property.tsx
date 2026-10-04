'use client'

import type { DateRange } from '@daypicker/react'
import { Calendar } from '@tc96/ui/calendar'
import { CalendarRangeIcon } from 'lucide-react'
import { useState } from 'react'
import {
  PropertyCalendarPopover,
  type PropertyCalendarProps,
  type PropertyPopoverDropdownPlacement,
} from '../../shared/property-calendar-popover'
import type { PropertyVariant } from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import { formatDateRangeProperty } from './date-range-format'

export type { DateRange }

export interface DateRangePropertyProps {
  value: DateRange | undefined
  allowClear?: boolean
  ariaLabel?: string
  calendarProps?: PropertyCalendarProps
  className?: string
  clearLabel?: string
  disabled?: boolean
  dropdownPlacement?: PropertyPopoverDropdownPlacement
  fallback?: string
  fromLabel?: string
  locale?: string
  numberOfMonths?: number
  readOnly?: boolean
  untilLabel?: string
  variant?: PropertyVariant
  onValueChange?: (value: DateRange | undefined) => void
}

export function DateRangeProperty({
  allowClear = true,
  ariaLabel,
  calendarProps,
  className,
  clearLabel = 'Limpar período',
  disabled = false,
  dropdownPlacement,
  fallback = 'Sem período',
  fromLabel,
  locale = 'en-US',
  numberOfMonths = 2,
  onValueChange,
  readOnly = false,
  untilLabel,
  value,
  variant = 'badge',
}: Readonly<DateRangePropertyProps>) {
  const [open, setOpen] = useState(false)
  const label = formatDateRangeProperty(value, fallback, locale, {
    fromLabel,
    untilLabel,
  })
  const isEmpty = label === fallback

  if (readOnly || !onValueChange) {
    return (
      <IconLabelProperty
        className={className}
        icon={CalendarRangeIcon}
        label={label}
        muted={isEmpty}
        variant={variant}
      />
    )
  }

  return (
    <PropertyCalendarPopover
      align="center"
      ariaLabel={ariaLabel ?? 'Period'}
      className={className}
      clear={
        allowClear
          ? {
              label: clearLabel,
              onClear: () => {
                onValueChange(undefined)
                setOpen(false)
              },
            }
          : undefined
      }
      disabled={disabled}
      dropdownPlacement={dropdownPlacement}
      icon={CalendarRangeIcon}
      label={label}
      muted={isEmpty}
      onOpenChange={setOpen}
      open={open}
      variant={variant}
    >
      <Calendar
        defaultMonth={value?.from}
        mode="range"
        numberOfMonths={numberOfMonths}
        selected={value}
        onSelect={onValueChange}
        {...calendarProps}
      />
    </PropertyCalendarPopover>
  )
}
