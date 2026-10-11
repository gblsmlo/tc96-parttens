'use client'

import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { CalendarIcon, RepeatIcon } from 'lucide-react'
import { useState } from 'react'
import type {
  PropertyCalendarProps,
  PropertyPopoverDropdownPlacement,
} from '../../shared/property-calendar-popover'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import {
  defaultSchedulePropertyLabels,
  type SchedulePropertyLabels,
} from './schedule-labels'
import { SchedulePopup } from './schedule-popup'
import type { ScheduleTimeControl } from './schedule-time-section'
import {
  defaultScheduleRecurrenceOptions,
  defaultScheduleReminderOptions,
  formatScheduleProperty,
  type ScheduleRecurrenceOption,
  type ScheduleReminderOption,
  type ScheduleValue,
  scheduleRecurrenceLabel,
  startOfLocalDay,
} from './schedule-value'

export type SchedulePropertyDropdownPlacement = PropertyPopoverDropdownPlacement

export interface SchedulePropertyProps {
  ariaLabel: string
  value: ScheduleValue
  calendarProps?: PropertyCalendarProps
  className?: string
  dateOnly?: boolean
  dropdownPlacement?: SchedulePropertyDropdownPlacement
  fallback?: string
  labels?: Partial<SchedulePropertyLabels>
  locale?: string
  readOnly?: boolean
  recurrenceEnabled?: boolean
  recurrenceOptions?: readonly ScheduleRecurrenceOption[]
  reminderOptions?: readonly ScheduleReminderOption[]
  remindersEnabled?: boolean
  timeControl?: ScheduleTimeControl
  today?: Date
  variant?: PropertyVariant
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: ScheduleValue) => void
}

function ScheduleSurfaceContent({
  label,
  repeats,
}: Readonly<{ label: string; repeats: boolean }>) {
  return (
    <>
      <CalendarIcon aria-hidden className="size-3" />
      <span className="truncate">{label}</span>
      {repeats ? <RepeatIcon aria-hidden className="size-3" /> : null}
    </>
  )
}

export function ScheduleProperty({
  ariaLabel,
  calendarProps,
  className,
  dateOnly = false,
  dropdownPlacement,
  fallback,
  labels: labelOverrides,
  locale = 'pt-BR',
  onOpenChange,
  onValueChange,
  readOnly = false,
  recurrenceEnabled,
  recurrenceOptions = defaultScheduleRecurrenceOptions,
  reminderOptions = defaultScheduleReminderOptions,
  remindersEnabled,
  timeControl = 'select',
  today = startOfLocalDay(new Date()),
  value,
  variant = 'badge',
}: Readonly<SchedulePropertyProps>) {
  const [open, setOpen] = useState(false)
  const labels = { ...defaultSchedulePropertyLabels, ...labelOverrides }
  const label = formatScheduleProperty(value, fallback ?? labels.noDate, locale)
  const repeatLabel = scheduleRecurrenceLabel(
    value.frequency,
    recurrenceOptions,
  )
  const accessibleName = [`${ariaLabel}: ${label}`, repeatLabel]
    .filter(Boolean)
    .join(' · ')

  const changeOpen = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  if (readOnly || !onValueChange) {
    return (
      <PropertySurface
        aria-label={accessibleName}
        className={cn('max-w-full', className)}
        muted={!value.from}
        variant={variant}
      >
        <ScheduleSurfaceContent label={label} repeats={Boolean(repeatLabel)} />
      </PropertySurface>
    )
  }

  return (
    <Popover onOpenChange={changeOpen} open={open}>
      <PopoverTrigger
        aria-label={accessibleName}
        render={
          <PropertySurface
            className={cn('max-w-full', className)}
            muted={!value.from}
            render={<button type="button" />}
            variant={variant}
          />
        }
      >
        <ScheduleSurfaceContent label={label} repeats={Boolean(repeatLabel)} />
      </PopoverTrigger>
      <PopoverPopup
        align="start"
        aria-label={ariaLabel}
        className="w-auto"
        side="bottom"
        {...dropdownPlacement}
      >
        <SchedulePopup
          calendarProps={calendarProps}
          dateOnly={dateOnly}
          labels={labels}
          locale={locale}
          onChange={onValueChange}
          onDone={() => changeOpen(false)}
          recurrenceEnabled={recurrenceEnabled}
          recurrenceOptions={recurrenceOptions}
          reminderOptions={reminderOptions}
          remindersEnabled={remindersEnabled}
          timeControl={timeControl}
          today={today}
          value={value}
        />
      </PopoverPopup>
    </Popover>
  )
}
