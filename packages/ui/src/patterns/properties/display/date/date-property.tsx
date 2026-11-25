'use client'

import type { DayPickerLocale } from '@daypicker/react'
import { Calendar } from '@tc96/ui/calendar'
import { formatDateTime } from '@tc96/ui/helpers/date'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import {
  PropertyCalendarPopover,
  type PropertyCalendarProps,
} from '../../shared/property-calendar-popover'
import type {
  PropertyChangeContext,
  PropertyPopoverDropdownPlacement,
} from '../../shared/property-catalog'
import { propertyDisplayIcons } from '../../shared/property-display-meta'
import {
  type DatePropertyLabels,
  defaultPropertyAriaLabels,
  defaultPropertyLabels,
  resolvePropertyLabels,
} from '../../shared/property-labels'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { PropertyTooltip } from '../../shared/property-tooltip'
import {
  formatDateProperty,
  parseDatePropertyValue,
  serializeDatePropertyValue,
} from './date-value'

export interface DatePropertyActionContext
  extends PropertyChangeContext<string | null> {
  date: Date | null
}

export interface DatePropertyProps {
  value: string | null
  action?: (value: string | null, context: DatePropertyActionContext) => void
  allowClear?: boolean
  ariaLabel?: string
  calendarLocale?: DayPickerLocale
  calendarProps?: PropertyCalendarProps
  className?: string
  disabled?: boolean
  displayLabel?: string
  dropdownPlacement?: PropertyPopoverDropdownPlacement
  isOverdue?: boolean
  labels?: Partial<DatePropertyLabels>
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
  disabled = false,
  displayLabel,
  dropdownPlacement,
  isOverdue = false,
  labels: labelOverrides,
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
  const accessibleLabel = ariaLabel ?? defaultPropertyAriaLabels.date
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.date,
    labelOverrides,
  )

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
        isOverdue={isOverdue}
        labels={labels}
        locale={locale}
        timeZone={timeZone}
        tooltip={tooltip}
        value={value}
        variant={variant}
      />
    )
  }

  const label =
    displayLabel ?? formatDateProperty(value, labels.fallback, locale, timeZone)

  return (
    <PropertyCalendarPopover
      ariaLabel={accessibleLabel}
      className={cn(isOverdue && 'font-medium', className)}
      muted={!value}
      clear={
        allowClear
          ? { label: labels.clear, onClear: () => handleChange(null, null) }
          : undefined
      }
      disabled={disabled}
      dropdownPlacement={dropdownPlacement}
      icon={propertyDisplayIcons.date}
      label={label}
      onOpenChange={setOpen}
      open={open}
      overdue={isOverdue}
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
  isOverdue = false,
  labels,
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
    | 'isOverdue'
    | 'labels'
    | 'locale'
    | 'timeZone'
    | 'tooltip'
    | 'value'
    | 'variant'
  >
>) {
  const fallback = labels?.fallback ?? defaultPropertyLabels.date.fallback
  const label =
    displayLabel ?? formatDateProperty(value, fallback, locale, timeZone)
  const fullDate = tooltip ? formatFullDate(value, locale, timeZone) : null

  const DateIcon = propertyDisplayIcons.date
  const surface = (
    <PropertySurface
      className={cn('max-w-full', isOverdue && 'font-medium', className)}
      data-overdue={isOverdue || undefined}
      data-slot="property-surface"
      muted={!value}
      tabIndex={fullDate ? 0 : undefined}
      variant={variant}
    >
      <DateIcon aria-hidden className="size-4" data-slot="property-icon" />
      <span className="truncate">{label}</span>
    </PropertySurface>
  )

  if (!fullDate) return surface

  return <PropertyTooltip content={fullDate} trigger={surface} />
}
