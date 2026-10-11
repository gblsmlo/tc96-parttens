'use client'

import { Button } from '@tc96/ui/button'
import { Calendar } from '@tc96/ui/calendar'
import { Separator } from '@tc96/ui/separator'
import { cn } from '@tc96/utils'
import { ClockIcon } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import type { PropertyCalendarProps } from '../../shared/property-calendar-popover'
import type { PropertyIcon } from '../../shared/property-catalog'
import type { SchedulePropertyLabels } from './schedule-labels'
import { buildSchedulePresets, type SchedulePreset } from './schedule-presets'
import { ScheduleRecurrenceSection } from './schedule-recurrence-section'
import { ScheduleRemindersSection } from './schedule-reminders-section'
import {
  type ScheduleTimeControl,
  ScheduleTimeSection,
} from './schedule-time-section'
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

function FooterToggle({
  active,
  children,
  disabled = false,
  icon: Icon,
  onClick,
}: Readonly<{
  active: boolean
  children: ReactNode
  disabled?: boolean
  icon?: PropertyIcon
  onClick: () => void
}>) {
  return (
    <Button
      aria-pressed={active}
      className="flex-1"
      disabled={disabled}
      onClick={onClick}
      size="sm"
      type="button"
      variant={active ? 'secondary' : 'ghost'}
    >
      {Icon ? <Icon aria-hidden /> : null}
      {children}
    </Button>
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
  recurrenceEnabled?: boolean
  remindersEnabled?: boolean
}

export function SchedulePopup({
  calendarProps,
  dateOnly,
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
  const [timeOpen, setTimeOpen] = useState(false)
  const [recurrenceOpen, setRecurrenceOpen] = useState(false)
  const [remindersOpen, setRemindersOpen] = useState(false)
  const [month, setMonth] = useState(value.from ?? today)
  const presets = buildSchedulePresets(today, labels, locale)

  const finish = () => {
    if (!timeOpen && !recurrenceOpen && !remindersOpen) onDone()
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

  return (
    <div className="flex w-72 flex-col" data-slot="schedule-popup">
      <div className="p-1">
        <PresetList label={labels.presets} onPick={pick} presets={presets} />
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
          <div className="flex gap-2 p-2">
            <FooterToggle
              active={timeOpen}
              icon={ClockIcon}
              onClick={() => setTimeOpen((open) => !open)}
            >
              {labels.time}
            </FooterToggle>
            <FooterToggle
              active={recurrenceOpen}
              disabled={!recurrenceEnabled}
              onClick={() => setRecurrenceOpen((open) => !open)}
            >
              {labels.repeat}
            </FooterToggle>
            <FooterToggle
              active={remindersOpen}
              disabled={!remindersEnabled}
              onClick={() => setRemindersOpen((open) => !open)}
            >
              {labels.reminders}
            </FooterToggle>
          </div>
          {timeOpen ? (
            <ScheduleTimeSection
              labels={labels}
              onChange={onChange}
              timeControl={timeControl}
              value={value}
            />
          ) : null}
          {recurrenceOpen && recurrenceEnabled ? (
            <ScheduleRecurrenceSection
              calendarProps={calendarProps}
              labels={labels}
              locale={locale}
              onChange={onChange}
              options={recurrenceOptions}
              value={value}
            />
          ) : null}
          {remindersOpen && remindersEnabled ? (
            <ScheduleRemindersSection
              labels={labels}
              onChange={onChange}
              options={reminderOptions}
              value={value}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
