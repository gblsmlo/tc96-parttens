'use client'

import type { DayPickerLocale } from '@daypicker/react'
import { formatDateTime } from '@tc96/helpers/date'
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
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { PropertyTooltip } from '../../shared/property-tooltip'
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
  calendarLocale?: DayPickerLocale
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
  tooltip?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: string | null) => void
}

function formatFullDate(
  value: string | null,
  locale: string,
  timeZone: string,
): string | null {
  const date = parseDatePropertyValue(value)
  return date ? formatDateTime(date, locale, timeZone) : null
}

export function DateProperty({
  action,
  allowClear = true,
  ariaLabel,
  calendarLocale,
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
  tooltip = false,
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
        tooltip={tooltip}
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
      className={cn(isOverdue && 'font-medium', className)}
      muted={!value}
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
      tooltip={tooltip ? formatFullDate(value, locale, timeZone) : null}
      variant={variant}
    >
      <Calendar
        defaultMonth={selectedDate ?? undefined}
        locale={calendarLocale}
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
  tooltip = false,
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
    | 'tooltip'
    | 'value'
    | 'variant'
  >
>) {
  const label =
    displayLabel ?? formatDateProperty(value, fallback, locale, timeZone)
  const fullDate = tooltip ? formatFullDate(value, locale, timeZone) : null

  if (fullDate) {
    return (
      <PropertyTooltip
        content={fullDate}
        trigger={
          <PropertySurface
            className={cn('max-w-full', isOverdue && 'font-medium', className)}
            data-slot="property-surface"
            tabIndex={0}
            variant={variant}
          >
            <CalendarDaysIcon
              aria-hidden
              className="size-3"
              data-slot="property-icon"
            />
            <span className="truncate">{label}</span>
          </PropertySurface>
        }
      />
    )
  }

  return (
    <IconLabelProperty
      className={cn(isOverdue && 'font-medium', className)}
      muted={!value}
      icon={CalendarDaysIcon}
      label={label}
      variant={variant}
    />
  )
}
