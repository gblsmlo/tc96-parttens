import {
  addCalendarDays,
  type CalendarDate,
  calendarDateKey,
  calendarRange,
  parseCalendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import {
  fromZonedDateTime,
  toZonedDateTime,
} from '@tc96/ui/helpers/zoned-date-time'
import type { Agenda1Entry, Agenda1Period, Agenda1Window } from './types'

export function agenda1TodayKey(now: Date, timeZone: string): string {
  return calendarDateKey(toZonedDateTime(now, timeZone).date)
}

export function agenda1Range(
  anchor: CalendarDate,
  period: Agenda1Period,
  weekStartsOn: 0 | 1,
): CalendarDate[] {
  return calendarRange(anchor, period, weekStartsOn)
}

export function agenda1Window(
  anchor: string,
  period: Agenda1Period,
  timeZone: string,
  weekStartsOn: 0 | 1 = 1,
): Agenda1Window {
  const date = parseCalendarDateKey(anchor)
  if (!date) throw new RangeError(`Invalid calendar date: ${anchor}`)
  const days = agenda1Range(date, period, weekStartsOn)
  const first = days[0] ?? date
  const last = days[days.length - 1] ?? date
  return {
    from: fromZonedDateTime(
      { date: first, minutes: 0 },
      timeZone,
    ).toISOString(),
    to: fromZonedDateTime(
      { date: addCalendarDays(last, 1), minutes: 0 },
      timeZone,
    ).toISOString(),
  }
}

export function shiftAgenda1Anchor(
  anchor: CalendarDate,
  period: Agenda1Period,
  direction: -1 | 1,
): CalendarDate {
  if (period === 'day') return addCalendarDays(anchor, direction)
  if (period === 'week') return addCalendarDays(anchor, 7 * direction)
  const month = anchor.month + direction
  return {
    day: 1,
    month: ((month + 11) % 12) + 1,
    year: anchor.year + Math.floor((month - 1) / 12),
  }
}

const asUtcDate = (date: CalendarDate) =>
  new Date(Date.UTC(date.year, date.month - 1, date.day, 12))

export interface Agenda1Formatters {
  dayKeyOf: (instant: string) => string
  dayLabel: (date: CalendarDate) => string
  periodTitle: (anchor: CalendarDate, period: Agenda1Period) => string
  time: (instant: string) => string
  when: (entry: Agenda1Entry, allDayLabel: string) => string[]
}

export function createAgenda1Formatters(
  locale: string,
  timeZone: string,
  weekStartsOn: 0 | 1,
): Agenda1Formatters {
  const dayTitle = new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  })
  const weekTitle = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  })
  const monthTitle = new Intl.DateTimeFormat(locale, {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  })
  const groupDay = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    weekday: 'long',
  })
  const entryDay = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone,
    weekday: 'short',
  })
  const entryTime = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZone,
    weekday: 'short',
  })
  const clock = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  })

  return {
    dayKeyOf: (instant) => agenda1TodayKey(new Date(instant), timeZone),
    dayLabel: (date) => groupDay.format(asUtcDate(date)),
    periodTitle: (anchor, period) => {
      if (period === 'day') return dayTitle.format(asUtcDate(anchor))
      if (period === 'month') return monthTitle.format(asUtcDate(anchor))
      const days = agenda1Range(anchor, 'week', weekStartsOn)
      return weekTitle.formatRange(
        asUtcDate(days[0] ?? anchor),
        asUtcDate(days[days.length - 1] ?? anchor),
      )
    },
    time: (instant) => clock.format(new Date(instant)),
    when: (entry, allDayLabel) => {
      const start = new Date(entry.start)
      const end = entry.end ? new Date(entry.end) : null
      if (entry.allDay) {
        const lastDay =
          end && end.getTime() > start.getTime()
            ? new Date(end.getTime() - 1)
            : start
        return [entryDay.formatRange(start, lastDay), allDayLabel]
      }
      return [end ? entryTime.formatRange(start, end) : entryTime.format(start)]
    },
  }
}
