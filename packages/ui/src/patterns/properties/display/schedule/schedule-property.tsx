'use client'

import type { DayPickerLocale } from '@daypicker/react'
import { RepeatIcon } from '@phosphor-icons/react'
import { Popover, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import type { PropertyCalendarProps } from '../../shared/property-calendar-popover'
import type { PropertyOption } from '../../shared/property-catalog'
import { propertyDisplayIcons } from '../../shared/property-display-meta'
import {
  defaultPropertyLabels,
  resolvePropertyLabels,
  type SchedulePropertyLabels,
} from '../../shared/property-labels'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { SchedulePopup } from './schedule-popup'
import {
  SchedulePopupFrame,
  type SchedulePropertyDropdownPlacement,
} from './schedule-popup-frame'
import type { ScheduleFooterLayout } from './schedule-section'
import type { ScheduleTimeControl } from './schedule-time-section'
import {
  formatScheduleProperty,
  type ScheduleValue,
  scheduleRecurrenceLabel,
  scheduleRecurrenceOptions,
  scheduleReminderOptions,
  startOfLocalDay,
} from './schedule-value'

export interface SchedulePropertyProps {
  ariaLabel: string
  value: ScheduleValue
  calendarLocale?: DayPickerLocale
  calendarProps?: PropertyCalendarProps
  className?: string
  dateOnly?: boolean
  dropdownPlacement?: SchedulePropertyDropdownPlacement
  footerLayout?: ScheduleFooterLayout
  labels?: Partial<SchedulePropertyLabels>
  locale?: string
  readOnly?: boolean
  recurrenceEnabled?: boolean
  recurrenceOptions?: readonly PropertyOption[]
  reminderOptions?: readonly PropertyOption[]
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
  const ScheduleIcon = propertyDisplayIcons.schedule

  return (
    <>
      <ScheduleIcon aria-hidden className="size-4" data-slot="property-icon" />
      <span className="truncate">{label}</span>
      {repeats ? <RepeatIcon aria-hidden className="size-4" /> : null}
    </>
  )
}

export function ScheduleProperty({
  ariaLabel,
  calendarLocale,
  calendarProps,
  className,
  dateOnly = false,
  dropdownPlacement,
  footerLayout,
  labels: labelOverrides,
  locale = 'en-US',
  onOpenChange,
  onValueChange,
  readOnly = false,
  recurrenceEnabled,
  recurrenceOptions: recurrenceOptionsProp,
  reminderOptions: reminderOptionsProp,
  remindersEnabled,
  timeControl = 'select',
  today = startOfLocalDay(new Date()),
  value,
  variant = 'badge',
}: Readonly<SchedulePropertyProps>) {
  const [open, setOpen] = useState(false)
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.schedule,
    labelOverrides,
  )
  const recurrenceOptions =
    recurrenceOptionsProp ?? scheduleRecurrenceOptions(labels)
  const reminderOptions = reminderOptionsProp ?? scheduleReminderOptions(labels)
  const label = formatScheduleProperty(value, labels.fallback, locale)
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
      <SchedulePopupFrame ariaLabel={ariaLabel} placement={dropdownPlacement}>
        <SchedulePopup
          calendarLocale={calendarLocale}
          calendarProps={calendarProps}
          dateOnly={dateOnly}
          footerLayout={footerLayout}
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
      </SchedulePopupFrame>
    </Popover>
  )
}
