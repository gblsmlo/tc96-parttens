import type { ArgTypes } from '@storybook/react-vite'
import type { CalendarEventChipTone, CalendarViewMode } from '@tc96/ui/patterns'

export const calendarModes: CalendarViewMode[] = ['day', 'week', 'month']

export const calendarEventChipTones = [
  'neutral',
  'primary',
  'success',
  'warning',
  'destructive',
] as const satisfies readonly NonNullable<CalendarEventChipTone>[]

export type CalendarToneName = (typeof calendarEventChipTones)[number]

export const calendarLocales = ['pt-BR', 'en-US'] as const

export type CalendarLocale = (typeof calendarLocales)[number]

export interface CalendarControls {
  action: boolean
  completed: boolean
  empty: boolean
  loading: boolean
  locale: CalendarLocale
  maxVisibleMonthRecords: number
  mode: CalendarViewMode
  openTrigger: boolean
  time: boolean
  tone: CalendarToneName
  weekStartsOn: 0 | 1
}

export const calendarControlArgs: CalendarControls = {
  action: false,
  completed: false,
  empty: false,
  loading: false,
  locale: 'pt-BR',
  maxVisibleMonthRecords: 3,
  mode: 'week',
  openTrigger: true,
  time: true,
  tone: 'neutral',
  weekStartsOn: 0,
}

export const calendarControlArgTypes: Partial<ArgTypes<CalendarControls>> = {
  action: {
    control: 'boolean',
    description:
      'Adds a complete button marked `data-calendar-item-action` to every item, raised above the open trigger.',
  },
  completed: {
    control: 'boolean',
    description:
      'Passes `completed` to the item of "Kickoff do trimestre", which dims it and strikes the title.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes a collection with no records.',
  },
  loading: {
    control: 'boolean',
    description:
      'The `loading` of `CalendarView`: skeletons replace the items.',
  },
  locale: {
    control: 'inline-radio',
    description: 'The `locale` of `CalendarView`, for the date labels.',
    options: calendarLocales,
  },
  maxVisibleMonthRecords: {
    control: { max: 4, min: 1, step: 1, type: 'number' },
    description:
      'The `maxVisibleMonthRecords` of `CalendarView`; acts only in `month`, where Wednesday 12 holds four items.',
  },
  mode: {
    control: 'inline-radio',
    description: 'The `mode` of `CalendarView`.',
    options: calendarModes,
  },
  openTrigger: {
    control: 'boolean',
    description:
      'Adds a `CalendarEventChipOpenTrigger` to every item, which turns the whole item into a button.',
  },
  time: {
    control: 'boolean',
    description:
      'Adds a `CalendarEventChipTime` to every timed item; all-day items never have one.',
  },
  tone: {
    control: 'inline-radio',
    description: 'The `tone` of every `CalendarEventChip`.',
    options: calendarEventChipTones,
  },
  weekStartsOn: {
    control: 'inline-radio',
    description:
      'The `weekStartsOn` of `CalendarView`: `0` for Sunday, `1` for Monday.',
    options: [0, 1],
  },
}
