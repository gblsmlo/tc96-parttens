import {
  CalendarBlankIcon,
  CheckSquareIcon,
  ClockIcon,
  FlagIcon,
  MapPinIcon,
  PhoneIcon,
  VideoCameraIcon,
} from '@phosphor-icons/react'
import type { CalendarEventChipTone } from '@tc96/ui/patterns/calendar/composition/calendar-event-chip/calendar-event-chip'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  Agenda1GroupBy,
  Agenda1Kind,
  Agenda1Modality,
  Agenda1Mode,
  Agenda1Period,
} from './types'

export const agenda1Modes: readonly Agenda1Mode[] = [
  'calendar',
  'list',
  'table',
]

export const agenda1Periods: readonly Agenda1Period[] = ['day', 'week', 'month']

export const agenda1Kinds: readonly Agenda1Kind[] = [
  'appointment',
  'task',
  'due',
  'deadline',
]

export const agenda1Modalities: readonly Agenda1Modality[] = [
  'in-person',
  'video',
  'phone',
]

export const agenda1Groupings: readonly Agenda1GroupBy[] = ['day', 'kind']

export const agenda1ReschedulableKinds: readonly Agenda1Kind[] = [
  'appointment',
  'task',
]

export const agenda1KindAppearance = {
  appointment: { icon: CalendarBlankIcon, tone: 'neutral' },
  deadline: { icon: FlagIcon, tone: 'danger' },
  due: { icon: ClockIcon, tone: 'warning' },
  task: { icon: CheckSquareIcon, tone: 'info' },
} as const satisfies Record<Agenda1Kind, DataOptionAppearance>

export const agenda1ModalityAppearance = {
  'in-person': { icon: MapPinIcon, tone: 'neutral' },
  phone: { icon: PhoneIcon, tone: 'neutral' },
  video: { icon: VideoCameraIcon, tone: 'neutral' },
} as const satisfies Record<Agenda1Modality, DataOptionAppearance>

export const agenda1ChipTones = {
  appointment: 'neutral',
  deadline: 'destructive',
  due: 'warning',
  task: 'primary',
} as const satisfies Record<Agenda1Kind, NonNullable<CalendarEventChipTone>>
