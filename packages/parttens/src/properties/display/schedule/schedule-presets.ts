import {
  CalendarIcon,
  CalendarOffIcon,
  CalendarRangeIcon,
  SunIcon,
  SunriseIcon,
} from 'lucide-react'
import type { PropertyIcon } from '../../shared/property-catalog'
import type { SchedulePropertyLabels } from './schedule-labels'
import { addLocalDays } from './schedule-value'

export interface SchedulePreset {
  day: Date | null
  hint: string
  icon: PropertyIcon
  label: string
}

const SATURDAY = 6
const MONDAY = 1

function nextWeekday(today: Date, weekday: number): Date {
  return addLocalDays(today, (weekday - today.getDay() + 7) % 7 || 7)
}

function capitalize(text: string, locale: string): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)
}

export function buildSchedulePresets(
  today: Date,
  labels: SchedulePropertyLabels,
  locale: string,
): readonly SchedulePreset[] {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdayAndDay = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  })
  const hint = (format: Intl.DateTimeFormat, date: Date) =>
    capitalize(format.format(date).replaceAll('.', ''), locale)

  const tomorrow = addLocalDays(today, 1)
  const weekend = nextWeekday(today, SATURDAY)
  const nextWeek = nextWeekday(today, MONDAY)

  return [
    {
      day: today,
      hint: hint(weekday, today),
      icon: CalendarIcon,
      label: labels.today,
    },
    {
      day: tomorrow,
      hint: hint(weekday, tomorrow),
      icon: SunIcon,
      label: labels.tomorrow,
    },
    {
      day: weekend,
      hint: hint(weekday, weekend),
      icon: SunriseIcon,
      label: labels.thisWeekend,
    },
    {
      day: nextWeek,
      hint: hint(weekdayAndDay, nextWeek),
      icon: CalendarRangeIcon,
      label: labels.nextWeek,
    },
    { day: null, hint: '', icon: CalendarOffIcon, label: labels.noDate },
  ]
}
