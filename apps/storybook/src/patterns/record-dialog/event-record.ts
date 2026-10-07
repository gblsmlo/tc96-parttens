import {
  addCalendarDays,
  fromZonedDateTime,
  type SelectPropertyGroup,
  type SelectPropertyOption,
  toZonedDateTime,
} from '@tc96/parttens'
import {
  BellIcon,
  BellOffIcon,
  BriefcaseIcon,
  CalendarIcon,
  CircleIcon,
  CoffeeIcon,
  HandshakeIcon,
} from 'lucide-react'
import { z } from 'zod'

export const TIME_ZONE = 'America/Sao_Paulo'

export const defaultSlot = {
  date: '2026-10-14T12:00:00.000Z',
  end: '15:00',
  start: '14:00',
}

export const calendarGroups: SelectPropertyGroup[] = [
  {
    label: 'Type',
    options: [
      { icon: CalendarIcon, label: 'Event', tone: 'neutral', value: 'event' },
      {
        icon: HandshakeIcon,
        label: 'Appointment',
        tone: 'neutral',
        value: 'appointment',
      },
    ],
  },
  {
    label: 'Calendar',
    options: [
      {
        icon: CircleIcon,
        label: 'Appointments',
        tone: 'danger',
        value: 'appointments',
      },
      { icon: CircleIcon, label: 'Sales', tone: 'info', value: 'sales' },
      {
        icon: CircleIcon,
        label: 'Personal',
        tone: 'success',
        value: 'personal',
      },
    ],
  },
]

export const dialogTitles: Record<string, string> = {
  appointment: 'New appointment',
}

export const availabilityOptions: SelectPropertyOption[] = [
  { icon: BriefcaseIcon, label: 'Busy', tone: 'neutral', value: 'busy' },
  { icon: CoffeeIcon, label: 'Free', tone: 'neutral', value: 'free' },
]

export const reminderOptions: SelectPropertyOption[] = [
  { icon: BellOffIcon, label: 'No reminder', tone: 'neutral', value: 'none' },
  {
    icon: BellIcon,
    label: '10 minutes before',
    tone: 'neutral',
    value: '10',
  },
  {
    icon: BellIcon,
    label: '30 minutes before',
    tone: 'neutral',
    value: '30',
  },
  { icon: BellIcon, label: '1 hour before', tone: 'neutral', value: '60' },
]

export const endBeforeStartMessage = 'End time must be after the start time.'
export const missingTimeMessage = 'Pick a start and an end time.'

export const eventSchema = z
  .object({
    allDay: z.boolean(),
    availability: z.enum(['busy', 'free']),
    calendar: z.enum([
      'event',
      'appointment',
      'appointments',
      'sales',
      'personal',
    ]),
    description: z.string().trim(),
    end: z.iso.datetime({ error: missingTimeMessage }),
    guests: z.array(z.string()),
    location: z.string().trim(),
    reminderMinutes: z.number().int().positive().nullable(),
    start: z.iso.datetime({ error: missingTimeMessage }),
    title: z.string().trim().min(1),
  })
  .refine((event) => event.end > event.start, {
    error: endBeforeStartMessage,
    path: ['end'],
  })

export type EventValues = z.infer<typeof eventSchema>

const parseMinutes = (time: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(time)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

export function eventWindow({
  allDay,
  date,
  end,
  start,
}: Readonly<{ allDay: boolean; date: string; end: string; start: string }>) {
  const day = toZonedDateTime(new Date(date), 'UTC').date
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
