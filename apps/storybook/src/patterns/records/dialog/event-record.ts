import {
  addCalendarDays,
  type CalendarDate,
  fromZonedDateTime,
  type SchedulePropertyLabels,
  type ScheduleRecurrenceOption,
  type ScheduleReminderOption,
  type ScheduleValue,
  type SelectPropertyOption,
  toZonedDateTime,
} from '@tc96/parttens'
import {
  BriefcaseIcon,
  CalendarIcon,
  CircleIcon,
  CoffeeIcon,
  HandshakeIcon,
} from 'lucide-react'
import { z } from 'zod'

export const TIME_ZONE = 'America/Sao_Paulo'

export interface EventSlot {
  date: string
  end: string
  start: string
}

export const defaultSlot: EventSlot = {
  date: '2026-10-14T12:00:00.000Z',
  end: '15:00',
  start: '14:00',
}

const formatMinutes = (minutes: number) => {
  const clamped = Math.min(minutes, 1439)
  return `${String(Math.floor(clamped / 60)).padStart(2, '0')}:${String(clamped % 60).padStart(2, '0')}`
}

export const slotFromCalendar = ({
  day,
  endMinutes,
  startMinutes,
}: Readonly<{
  day: CalendarDate
  endMinutes: number
  startMinutes: number
}>): EventSlot => ({
  date: new Date(Date.UTC(day.year, day.month - 1, day.day, 12)).toISOString(),
  end: formatMinutes(endMinutes),
  start: formatMinutes(startMinutes),
})

export const typeOptions: SelectPropertyOption[] = [
  { icon: CalendarIcon, label: 'Event', tone: 'neutral', value: 'event' },
  {
    icon: HandshakeIcon,
    label: 'Appointment',
    tone: 'neutral',
    value: 'appointment',
  },
]

export const calendarOptions: SelectPropertyOption[] = [
  {
    icon: CircleIcon,
    label: 'Appointments',
    tone: 'danger',
    value: 'appointments',
  },
  { icon: CircleIcon, label: 'Sales', tone: 'info', value: 'sales' },
  { icon: CircleIcon, label: 'Personal', tone: 'success', value: 'personal' },
]

export const dialogTitles: Record<string, string> = {
  appointment: 'New appointment',
}

export const availabilityOptions: SelectPropertyOption[] = [
  { icon: BriefcaseIcon, label: 'Busy', tone: 'neutral', value: 'busy' },
  { icon: CoffeeIcon, label: 'Free', tone: 'neutral', value: 'free' },
]

export const scheduleLabels: Partial<SchedulePropertyLabels> = {
  addReminder: 'Add reminder',
  allDay: 'All day',
  back: 'Back',
  end: 'End',
  frequency: 'Frequency',
  nextWeek: 'Next week',
  noDate: 'No date',
  noReminders: 'No reminders found.',
  noRepeat: 'Does not repeat',
  presets: 'Date shortcuts',
  reminders: 'Reminders',
  removeReminder: 'Remove reminder',
  repeat: 'Repeat',
  start: 'Start',
  thisWeekend: 'This weekend',
  time: 'Time',
  today: 'Today',
  tomorrow: 'Tomorrow',
  until: 'Until',
  untilFallback: 'No end date',
}

export const scheduleRecurrenceOptions: readonly ScheduleRecurrenceOption[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekdays', value: 'weekdays' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

export const scheduleReminderOptions: readonly ScheduleReminderOption[] = [
  { label: '10 minutes before', value: '10' },
  { label: '30 minutes before', value: '30' },
  { label: '1 hour before', value: '60' },
  { label: '1 day before', value: '1440' },
]

export const endBeforeStartMessage = 'End time must be after the start time.'
export const missingTimeMessage = 'Pick a start and an end time.'

export const eventSchema = z
  .object({
    allDay: z.boolean(),
    availability: z.enum(['busy', 'free']),
    calendar: z.enum(['appointments', 'sales', 'personal']),
    description: z.string().trim(),
    end: z.iso.datetime({ error: missingTimeMessage }),
    frequency: z.string().nullable(),
    guests: z.array(z.string()),
    location: z.string().trim(),
    reminderMinutes: z.array(z.number().int().positive()),
    start: z.iso.datetime({ error: missingTimeMessage }),
    title: z.string().trim().min(1),
    type: z.enum(['event', 'appointment']),
    until: z.string().nullable(),
  })
  .refine((event) => event.end > event.start, {
    error: endBeforeStartMessage,
    path: ['end'],
  })

export type EventValues = z.infer<typeof eventSchema>

export const slotSchedule = (slot: EventSlot): ScheduleValue => {
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

export const scheduleDay = (schedule: ScheduleValue): CalendarDate | null =>
  schedule.from
    ? {
        day: schedule.from.getDate(),
        month: schedule.from.getMonth() + 1,
        year: schedule.from.getFullYear(),
      }
    : null

const parseMinutes = (time: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(time)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

export function eventWindow({
  allDay,
  day,
  end,
  start,
}: Readonly<{
  allDay: boolean
  day: CalendarDate | null
  end: string
  start: string
}>) {
  if (!day) return { end: null, start: null }
  if (allDay) {
    return {
      end: fromZonedDateTime(
        { date: addCalendarDays(day, 1), minutes: 0 },
        TIME_ZONE,
      ).toISOString(),
      start: fromZonedDateTime(
        { date: day, minutes: 0 },
        TIME_ZONE,
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
            TIME_ZONE,
          ).toISOString(),
    start:
      startMinutes === null
        ? null
        : fromZonedDateTime(
            { date: day, minutes: startMinutes },
            TIME_ZONE,
          ).toISOString(),
  }
}
