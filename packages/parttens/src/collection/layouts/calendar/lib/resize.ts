import {
  fromZonedDateTime,
  toZonedDateTime,
} from '@tc96/helpers/zoned-date-time'
import type { CalendarRecordSchedule } from '../types'

export type CalendarResizeEdge = 'end' | 'start'
export type CalendarResizeDirection = 'earlier' | 'later'

export interface CalendarResizeGrid {
  snapMinutes: number
  timeZone: string
}

const MINUTE_MS = 60_000

type SlotRounding = (minutes: number, snapMinutes: number) => number

const nearestSlot: SlotRounding = (minutes, snap) =>
  Math.round(minutes / snap) * snap
const nextSlot: SlotRounding = (minutes, snap) =>
  Math.floor(minutes / snap) * snap + snap
const previousSlot: SlotRounding = (minutes, snap) =>
  Math.ceil(minutes / snap) * snap - snap

function alignToSlot(
  instant: Date,
  { snapMinutes, timeZone }: CalendarResizeGrid,
  round: SlotRounding,
): Date {
  const zoned = toZonedDateTime(instant, timeZone)
  const seconds = instant.getUTCSeconds() + instant.getUTCMilliseconds() / 1000
  const minutes = zoned.minutes + seconds / 60

  return fromZonedDateTime(
    { date: zoned.date, minutes: round(minutes, snapMinutes) },
    timeZone,
  )
}

function withEdge(
  schedule: CalendarRecordSchedule,
  edge: CalendarResizeEdge,
  target: Date,
  snapMinutes: number,
): CalendarRecordSchedule | null {
  if (!schedule.end || schedule.isAllDay) return null

  const start = schedule.start.getTime()
  const end = schedule.end.getTime()
  const minDuration = snapMinutes * MINUTE_MS

  return edge === 'start'
    ? {
        ...schedule,
        start: new Date(Math.min(target.getTime(), end - minDuration)),
      }
    : {
        ...schedule,
        end: new Date(Math.max(target.getTime(), start + minDuration)),
      }
}

function edgeOf(schedule: CalendarRecordSchedule, edge: CalendarResizeEdge) {
  return edge === 'start' ? schedule.start : schedule.end
}

export function resizeCalendarSchedule(
  schedule: CalendarRecordSchedule,
  edge: CalendarResizeEdge,
  deltaMinutes: number,
  grid: CalendarResizeGrid,
): CalendarRecordSchedule | null {
  const current = edgeOf(schedule, edge)
  if (!current) return null

  const target = alignToSlot(
    new Date(current.getTime() + deltaMinutes * MINUTE_MS),
    grid,
    nearestSlot,
  )
  return withEdge(schedule, edge, target, grid.snapMinutes)
}

export function stepCalendarScheduleEdge(
  schedule: CalendarRecordSchedule,
  edge: CalendarResizeEdge,
  direction: CalendarResizeDirection,
  grid: CalendarResizeGrid,
): CalendarRecordSchedule | null {
  const current = edgeOf(schedule, edge)
  if (!current) return null

  const target = alignToSlot(
    current,
    grid,
    direction === 'later' ? nextSlot : previousSlot,
  )
  return withEdge(schedule, edge, target, grid.snapMinutes)
}
