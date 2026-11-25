'use client'

import type { DateRange, DayPickerLocale } from '@daypicker/react'
import { Calendar } from '@tc96/ui/calendar'
import { useState } from 'react'
import {
  PropertyCalendarPopover,
  type PropertyCalendarProps,
} from '../../shared/property-calendar-popover'
import type { PropertyPopoverDropdownPlacement } from '../../shared/property-catalog'
import { propertyDisplayIcons } from '../../shared/property-display-meta'
import {
  type DateRangePropertyLabels,
  defaultPropertyAriaLabels,
  defaultPropertyLabels,
  resolvePropertyLabels,
} from '../../shared/property-labels'
import type { PropertyVariant } from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import { formatDateRangeProperty } from './date-range-format'

export type { DateRange }

export interface DateRangePropertyProps {
  value: DateRange | undefined
  allowClear?: boolean
  ariaLabel?: string
  calendarLocale?: DayPickerLocale
  calendarProps?: PropertyCalendarProps
  className?: string
  disabled?: boolean
  displayLabel?: string
  dropdownPlacement?: PropertyPopoverDropdownPlacement
  labels?: Partial<DateRangePropertyLabels>
  locale?: string
  numberOfMonths?: number
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: DateRange | undefined) => void
}

export function DateRangeProperty({
  allowClear = true,
  ariaLabel,
  calendarLocale,
  calendarProps,
  className,
  disabled = false,
  displayLabel,
  dropdownPlacement,
  labels: labelOverrides,
  locale = 'en-US',
  numberOfMonths = 2,
  onValueChange,
  readOnly = false,
  value,
  variant = 'badge',
}: Readonly<DateRangePropertyProps>) {
  const [open, setOpen] = useState(false)
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.dateRange,
    labelOverrides,
  )
  const formatted = formatDateRangeProperty(
    value,
    labels.fallback,
    locale,
    labels,
  )
  const isEmpty = formatted === labels.fallback
  const label = isEmpty ? formatted : (displayLabel ?? formatted)

  if (readOnly || !onValueChange) {
    return (
      <IconLabelProperty
        className={className}
        icon={propertyDisplayIcons.dateRange}
        label={label}
        muted={isEmpty}
        variant={variant}
      />
    )
  }

  return (
    <PropertyCalendarPopover
      align="center"
      ariaLabel={ariaLabel ?? defaultPropertyAriaLabels.dateRange}
      className={className}
      clear={
        allowClear
          ? {
              label: labels.clear,
              onClear: () => {
                onValueChange(undefined)
                setOpen(false)
              },
            }
          : undefined
      }
      disabled={disabled}
      dropdownPlacement={dropdownPlacement}
      icon={propertyDisplayIcons.dateRange}
      label={label}
      muted={isEmpty}
      onOpenChange={setOpen}
      open={open}
      variant={variant}
    >
      <Calendar
        defaultMonth={value?.from}
        locale={calendarLocale}
        mode="range"
        numberOfMonths={numberOfMonths}
        selected={value}
        onSelect={onValueChange}
        {...calendarProps}
      />
    </PropertyCalendarPopover>
  )
}
