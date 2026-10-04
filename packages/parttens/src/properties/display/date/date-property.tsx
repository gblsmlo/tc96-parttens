'use client'

import { Calendar } from '@tc96/ui/calendar'
import { cn } from '@tc96/utils'
import { CalendarDaysIcon } from 'lucide-react'
import { useState } from 'react'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import {
  PropertyCalendarPopover,
  type PropertyCalendarProps,
  type PropertyPopoverDropdownPlacement,
} from '../../shared/property-calendar-popover'
import type { PropertyVariant } from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import {
  formatDateProperty,
  parseDatePropertyValue,
  serializeDatePropertyValue,
} from './date-value'

export type DatePropertyDropdownPlacement = PropertyPopoverDropdownPlacement

export interface DatePropertyActionContext {
  date: Date | null
  previousValue: string | null
}

export interface DatePropertyProps {
  value: string | null
  action?: (value: string | null, context: DatePropertyActionContext) => void
  allowClear?: boolean
  ariaLabel?: string
  calendarProps?: PropertyCalendarProps
  className?: string
  clearLabel?: string
  fallback?: string
  disabled?: boolean
  displayLabel?: string
  dropdownPlacement?: DatePropertyDropdownPlacement
  isOverdue?: boolean
  locale?: string
  readOnly?: boolean
  serializeDate?: (date: Date) => string
  timeZone?: string
  variant?: PropertyVariant
  onValueChange?: (value: string | null) => void
}

export function DateProperty({
  action,
  allowClear = true,
  ariaLabel,
  calendarProps,
  className,
  clearLabel = 'Limpar data',
  disabled = false,
  displayLabel,
  dropdownPlacement,
  fallback = 'Sem data',
  isOverdue = false,
  locale = 'en-US',
  onValueChange,
  readOnly = false,
  serializeDate = serializeDatePropertyValue,
  timeZone = 'UTC',
  value,
  variant = 'badge',
}: Readonly<DatePropertyProps>) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseDatePropertyValue(value)
  const accessibleLabel = ariaLabel ?? 'Date'

  const handleChange = (nextValue: string | null, date: Date | null) => {
    if (nextValue !== value) {
      emitChange({ action, onValueChange }, nextValue, {
        date,
        previousValue: value,
      })
    }
    setOpen(false)
  }

  if (!isEditable({ action, onValueChange, readOnly })) {
    return (
      <DatePropertyBadge
        className={className}
        displayLabel={displayLabel}
        fallback={fallback}
        isOverdue={isOverdue}
        locale={locale}
        timeZone={timeZone}
        value={value}
        variant={variant}
      />
    )
  }

  const label =
    displayLabel ?? formatDateProperty(value, fallback, locale, timeZone)

  return (
    <PropertyCalendarPopover
      ariaLabel={accessibleLabel}
      className={cn(
        isOverdue && 'font-medium',
        !value && 'text-muted-foreground',
        className,
      )}
      clear={
        allowClear
          ? { label: clearLabel, onClear: () => handleChange(null, null) }
          : undefined
      }
      disabled={disabled}
      dropdownPlacement={dropdownPlacement}
      icon={CalendarDaysIcon}
      label={label}
      onOpenChange={setOpen}
      open={open}
      variant={variant}
    >
      <Calendar
        defaultMonth={selectedDate ?? undefined}
        mode="single"
        selected={selectedDate ?? undefined}
        onSelect={(date) => {
          if (!date) return
          handleChange(serializeDate(date), date)
        }}
        {...calendarProps}
      />
    </PropertyCalendarPopover>
  )
}

export function DatePropertyBadge({
  className,
  displayLabel,
  fallback = 'Sem data',
  isOverdue = false,
  locale = 'en-US',
  timeZone = 'UTC',
  value,
  variant = 'badge',
}: Readonly<
  Pick<
    DatePropertyProps,
    | 'className'
    | 'displayLabel'
    | 'fallback'
    | 'isOverdue'
    | 'locale'
    | 'timeZone'
    | 'value'
    | 'variant'
  >
>) {
  const label =
    displayLabel ?? formatDateProperty(value, fallback, locale, timeZone)

  return (
    <IconLabelProperty
      className={cn(
        isOverdue && 'font-medium',
        !value && 'text-muted-foreground',
        className,
      )}
      icon={CalendarDaysIcon}
      label={label}
      variant={variant}
    />
  )
}
