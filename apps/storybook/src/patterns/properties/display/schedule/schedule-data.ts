import { emptyScheduleValue, type ScheduleValue } from '@tc96/ui/patterns'

export const scheduleToday = new Date(2026, 9, 7)

export const timedWeeklySchedule: ScheduleValue = {
  allDay: false,
  endTime: '16:00',
  frequency: 'weekly',
  from: new Date(2026, 9, 26),
  reminders: ['30', '1440'],
  startTime: '14:00',
  until: '2026-12-18T12:00:00.000Z',
}

export const allDaySchedule: ScheduleValue = {
  ...emptyScheduleValue,
  from: new Date(2026, 9, 28),
}

export const scheduleValues = {
  allDay: allDaySchedule,
  empty: emptyScheduleValue,
  timedWeekly: timedWeeklySchedule,
} satisfies Record<string, ScheduleValue>

export type ScheduleValueName = keyof typeof scheduleValues

export const scheduleValueNames = Object.keys(
  scheduleValues,
) as ScheduleValueName[]
