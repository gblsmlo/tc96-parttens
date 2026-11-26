import type { CalendarDate } from '@tc96/ui/helpers/calendar-date'
import { addCalendarDays } from '@tc96/ui/helpers/calendar-date'
import {
  fromZonedDateTime,
  toZonedDateTime,
} from '@tc96/ui/helpers/zoned-date-time'
import type { ScheduleValue } from '@tc96/ui/patterns/properties/core'
import type { RecordDialog2Slot } from './types'

export const RECORD_DIALOG_2_TIME_ZONE = 'America/Sao_Paulo'

export const defaultRecordDialog2Slot: RecordDialog2Slot = {
  date: '2026-10-14T12:00:00.000Z',
  end: '15:00',
  start: '14:00',
}

const formatMinutes = (minutes: number) => {
  const clamped = Math.min(minutes, 1439)
  return `${String(Math.floor(clamped / 60)).padStart(2, '0')}:${String(clamped % 60).padStart(2, '0')}`
}

export function recordDialog2SlotFromCalendar({
  day,
  endMinutes,
  startMinutes,
}: Readonly<{
  day: CalendarDate
  endMinutes: number
  startMinutes: number
}>): RecordDialog2Slot {
  return {
    date: new Date(
      Date.UTC(day.year, day.month - 1, day.day, 12),
    ).toISOString(),
    end: formatMinutes(endMinutes),
    start: formatMinutes(startMinutes),
  }
}

export function recordDialog2SlotSchedule(
  slot: RecordDialog2Slot,
): ScheduleValue {
  const { day, month, year } = toZonedDateTime(new Date(slot.date), 'UTC').date
  return {
    allDay: false,
    endTime: slot.end,
    frequency: null,
    from: new Date(year, month - 1, day),
    reminders: ['30'],
    startTime: slot.start,
    until: null,
  }
}

export function recordDialog2ScheduleDay(
  schedule: ScheduleValue,
): CalendarDate | null {
  return schedule.from
    ? {
        day: schedule.from.getDate(),
        month: schedule.from.getMonth() + 1,
        year: schedule.from.getFullYear(),
      }
    : null
}

const parseMinutes = (time: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(time)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

export function recordDialog2EventWindow({
  allDay,
  day,
  end,
  start,
  timeZone,
}: Readonly<{
  allDay: boolean
  day: CalendarDate | null
  end: string
  start: string
  timeZone: string
}>): { end: string | null; start: string | null } {
  if (!day) return { end: null, start: null }
  if (allDay) {
    return {
      end: fromZonedDateTime(
        { date: addCalendarDays(day, 1), minutes: 0 },
        timeZone,
      ).toISOString(),
      start: fromZonedDateTime(
        { date: day, minutes: 0 },
        timeZone,
      ).toISOString(),
    }
  }

  const startMinutes = parseMinutes(start)
  const endMinutes = parseMinutes(end)
  return {
    end:
      endMinutes === null
        ? null
        : fromZonedDateTime(
            { date: day, minutes: endMinutes },
            timeZone,
          ).toISOString(),
    start:
      startMinutes === null
        ? null
        : fromZonedDateTime(
            { date: day, minutes: startMinutes },
            timeZone,
          ).toISOString(),
  }
}
