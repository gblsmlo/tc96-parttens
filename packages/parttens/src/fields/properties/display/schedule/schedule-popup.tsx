'use client'

import { Calendar } from '@tc96/ui/calendar'
import { Separator } from '@tc96/ui/separator'
import { cn } from '@tc96/utils'
import { useRef, useState } from 'react'
import type { PropertyCalendarProps } from '../../shared/property-calendar-popover'
import { ScheduleDetailView } from './schedule-detail-view'
import {
  ScheduleFooterDrillIn,
  ScheduleFooterRows,
} from './schedule-footer-rows'
import type { SchedulePropertyLabels } from './schedule-labels'
import { buildSchedulePresets, type SchedulePreset } from './schedule-presets'
import type {
  ScheduleFooterLayout,
  ScheduleFooterProps,
  ScheduleSection,
} from './schedule-section'
import type { ScheduleTimeControl } from './schedule-time-section'
import type {
  ScheduleRecurrenceOption,
  ScheduleReminderOption,
  ScheduleValue,
} from './schedule-value'

function PresetList({
  label,
  onPick,
  presets,
}: Readonly<{
  label: string
  onPick: (day: Date | null) => void
  presets: readonly SchedulePreset[]
}>) {
  return (
    <ul aria-label={label} className="flex flex-col">
      {presets.map(({ day, hint, icon: Icon, label: presetLabel }) => (
        <li key={presetLabel}>
          <button
            className={cn(
              'flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
              !day && 'text-muted-foreground',
            )}
            data-slot="schedule-preset"
            onClick={() => onPick(day)}
            type="button"
          >
            <Icon aria-hidden className="size-4 shrink-0 opacity-80" />
            <span className="flex-1 truncate text-start">{presetLabel}</span>
            {hint ? (
              <span className="shrink-0 text-muted-foreground text-xs">
                {hint}
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  )
}

export interface SchedulePopupProps {
  dateOnly: boolean
  labels: SchedulePropertyLabels
  locale: string
  onChange: (value: ScheduleValue) => void
  onDone: () => void
  recurrenceOptions: readonly ScheduleRecurrenceOption[]
  reminderOptions: readonly ScheduleReminderOption[]
  timeControl: ScheduleTimeControl
  today: Date
  value: ScheduleValue
  calendarProps?: PropertyCalendarProps
  footerLayout?: ScheduleFooterLayout
  recurrenceEnabled?: boolean
  remindersEnabled?: boolean
}

export function SchedulePopup({
  calendarProps,
  dateOnly,
  footerLayout = 'rows',
  labels,
  locale,
  onChange,
  onDone,
  recurrenceEnabled: recurrenceEnabledProp,
  recurrenceOptions,
  reminderOptions,
  remindersEnabled: remindersEnabledProp,
  timeControl,
  today,
  value,
}: Readonly<SchedulePopupProps>) {
  const recurrenceEnabled = recurrenceEnabledProp ?? Boolean(value.from)
  const remindersEnabled = remindersEnabledProp ?? Boolean(value.from)
  const [active, setActive] = useState<ScheduleSection | null>(null)
  const [month, setMonth] = useState(value.from ?? today)
  const returnFocusRef = useRef<ScheduleSection | null>(null)
  const presets = buildSchedulePresets(today, labels, locale)
  const drillIn = footerLayout === 'drill-in'
  const enabled = {
    reminders: remindersEnabled,
    repeat: recurrenceEnabled,
    time: true,
  }

  const finish = () => {
    if (!active) onDone()
  }

  const select = (section: ScheduleSection) => {
    setActive((current) => (current === section ? null : section))
  }

  const back = () => {
    returnFocusRef.current = active
    setActive(null)
  }

  const restoreFocus =
    (section: ScheduleSection) => (element: HTMLButtonElement | null) => {
      if (element && returnFocusRef.current === section) {
        returnFocusRef.current = null
        element.focus()
      }
    }

  const pick = (day: Date | null) => {
    if (day?.getTime() !== value.from?.getTime()) {
      onChange({
        ...value,
        from: day,
        ...(day ? {} : { frequency: null, reminders: [], until: null }),
      })
    }
    if (day) setMonth(day)
    finish()
  }

  const footerProps: ScheduleFooterProps = {
    active,
    calendarProps,
    enabled,
    labels,
    locale,
    onChange,
    onSelect: select,
    recurrenceOptions,
    reminderOptions,
    timeControl,
    value,
  }
  const detail = drillIn && active && enabled[active] ? active : null

  return (
    <div className="flex w-72 flex-col" data-slot="schedule-popup">
      {detail ? (
        <ScheduleDetailView {...footerProps} onBack={back} section={detail} />
      ) : (
        <div className="flex flex-col">
          <div className="p-1">
            <PresetList
              label={labels.presets}
              onPick={pick}
              presets={presets}
            />
          </div>
          <Separator className="my-2" />
          <Calendar
            {...calendarProps}
            className={cn(
              'w-full px-1 [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(10)]',
              calendarProps?.className,
            )}
            mode="single"
            month={month}
            onMonthChange={setMonth}
            onSelect={(day) => (day ? pick(day) : finish())}
            selected={value.from ?? undefined}
            today={today}
          />
          {dateOnly ? null : (
            <>
              <Separator className="my-2" />
              {drillIn ? (
                <ScheduleFooterDrillIn {...footerProps} rowRef={restoreFocus} />
              ) : (
                <ScheduleFooterRows {...footerProps} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
