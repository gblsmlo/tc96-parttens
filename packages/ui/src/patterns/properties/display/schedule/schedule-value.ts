import type { PropertyOption } from '../../shared/property-catalog'
import {
  defaultPropertyLabels,
  type SchedulePropertyLabels,
} from '../../shared/property-labels'

export interface ScheduleValue {
  allDay: boolean
  endTime: string
  frequency: string | null
  from: Date | null
  reminders: readonly string[]
  startTime: string
  until: string | null
}

export const emptyScheduleValue: ScheduleValue = {
  allDay: true,
  endTime: '',
  frequency: null,
  from: null,
  reminders: [],
  startTime: '',
  until: null,
}

export function scheduleRecurrenceOptions(
  labels: Pick<
    SchedulePropertyLabels,
    'daily' | 'monthly' | 'weekdays' | 'weekly' | 'yearly'
  >,
): readonly PropertyOption[] {
  return [
    { label: labels.daily, value: 'daily' },
    { label: labels.weekdays, value: 'weekdays' },
    { label: labels.weekly, value: 'weekly' },
    { label: labels.monthly, value: 'monthly' },
    { label: labels.yearly, value: 'yearly' },
  ]
}

export function scheduleReminderOptions(
  labels: Pick<
    SchedulePropertyLabels,
    | 'oneDayBefore'
    | 'oneHourBefore'
    | 'tenMinutesBefore'
    | 'thirtyMinutesBefore'
  >,
): readonly PropertyOption[] {
  return [
    { label: labels.tenMinutesBefore, value: '10' },
    { label: labels.thirtyMinutesBefore, value: '30' },
    { label: labels.oneHourBefore, value: '60' },
    { label: labels.oneDayBefore, value: '1440' },
  ]
}

export const defaultScheduleRecurrenceOptions: readonly PropertyOption[] =
  scheduleRecurrenceOptions(defaultPropertyLabels.schedule)

export const defaultScheduleReminderOptions: readonly PropertyOption[] =
  scheduleReminderOptions(defaultPropertyLabels.schedule)

export function sortScheduleReminders(
  reminders: readonly string[],
  options: readonly PropertyOption[],
): string[] {
  const rank = (reminder: string) => {
    const index = options.findIndex((option) => option.value === reminder)
    return index === -1 ? options.length : index
  }

  return [...reminders].sort((left, right) => rank(left) - rank(right))
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addLocalDays(date: Date, days: number): Date {
  const next = startOfLocalDay(date)
  next.setDate(next.getDate() + days)
  return next
}

export function formatScheduleDay(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })
    .format(date)
    .replaceAll('.', '')
}

export function formatScheduleProperty(
  value: ScheduleValue,
  fallback: string,
  locale: string,
): string {
  if (!value.from) return fallback

  const parts = [formatScheduleDay(value.from, locale)]
  if (!value.allDay && value.startTime) {
    parts.push(
      value.endTime ? `${value.startTime} – ${value.endTime}` : value.startTime,
    )
  }

  return parts.join(' · ')
}

export function scheduleRecurrenceLabel(
  frequency: string | null,
  options: readonly PropertyOption[],
): string | null {
  if (!frequency) return null
  return options.find((option) => option.value === frequency)?.label ?? null
}
