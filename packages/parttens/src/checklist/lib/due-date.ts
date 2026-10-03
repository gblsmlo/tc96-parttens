import {
  dayOffsetInTimeZone,
  formatRelativeDay,
  formatShortDate,
  parseIsoDate,
} from '@tc96/helpers/date'
import type { ChecklistDueStatus } from './variants'

export function calendarDayOffset(
  value: string | null | undefined,
  now: Date,
  timeZone: string,
): number | null {
  const due = parseIsoDate(value)
  return due ? dayOffsetInTimeZone(now, due, timeZone) : null
}

export function dueStatus(dayOffset: number | null): ChecklistDueStatus {
  if (dayOffset === null || dayOffset > 0) return 'upcoming'
  return dayOffset < 0 ? 'overdue' : 'today'
}

export function formatChecklistDueDate(
  value: string | null,
  locale: string,
  timeZone: string,
  dayOffset: number | null,
): string {
  if (dayOffset !== null && Math.abs(dayOffset) <= 1)
    return formatRelativeDay(dayOffset, locale)
  const due = parseIsoDate(value)
  return due ? formatShortDate(due, locale, timeZone) : 'No due date'
}
