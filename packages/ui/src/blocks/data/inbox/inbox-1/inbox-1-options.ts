import {
  CalendarDotsIcon,
  CalendarXIcon,
  GavelIcon,
  type Icon,
  ListChecksIcon,
  NewspaperIcon,
  PulseIcon,
  TrayIcon,
  UserCheckIcon,
} from '@phosphor-icons/react'
import type {
  Inbox1Category,
  Inbox1DueTone,
  Inbox1Kind,
  Inbox1ReadFilter,
  Inbox1ReceivedFilter,
  Inbox1Sort,
} from './types'

export const inbox1Categories: readonly Inbox1Category[] = [
  'tasks',
  'deadlines',
  'court',
  'monitoring',
]

export const inbox1Kinds: readonly Inbox1Kind[] = [
  'task-assigned',
  'task-due',
  'deadline-internal',
  'deadline-fatal',
  'publication',
  'movement',
  'deadline-at-risk',
  'deadline-stalled',
  'failure-opened',
]

export const inbox1KindsByCategory = {
  court: ['publication', 'movement'],
  deadlines: [
    'deadline-internal',
    'deadline-fatal',
    'deadline-at-risk',
    'deadline-stalled',
  ],
  monitoring: ['failure-opened'],
  tasks: ['task-assigned', 'task-due'],
} as const satisfies Record<Inbox1Category, readonly Inbox1Kind[]>

export const inbox1Sorts: readonly Inbox1Sort[] = ['newest', 'oldest', 'unread']

export const inbox1ReadFilters: readonly Inbox1ReadFilter[] = ['unread', 'read']

export const inbox1ReceivedFilters: readonly Inbox1ReceivedFilter[] = [
  'today',
  'last7',
  'last30',
]

export function inbox1KindsOf(
  category: Inbox1Category | null,
): readonly Inbox1Kind[] {
  return category ? inbox1KindsByCategory[category] : inbox1Kinds
}

export const inbox1CategoryIcons = {
  all: TrayIcon,
  court: GavelIcon,
  deadlines: CalendarDotsIcon,
  monitoring: PulseIcon,
  tasks: ListChecksIcon,
} as const satisfies Record<Inbox1Category | 'all', Icon>

export const inbox1KindIcons = {
  'deadline-at-risk': CalendarXIcon,
  'deadline-fatal': CalendarDotsIcon,
  'deadline-internal': CalendarDotsIcon,
  'deadline-stalled': CalendarDotsIcon,
  'failure-opened': PulseIcon,
  movement: GavelIcon,
  publication: NewspaperIcon,
  'task-assigned': UserCheckIcon,
  'task-due': ListChecksIcon,
} as const satisfies Record<Inbox1Kind, Icon>

export const inbox1DueToneClasses = {
  attention: 'text-warning-foreground',
  error: 'font-medium text-destructive-foreground',
  neutral: undefined,
} as const satisfies Record<Inbox1DueTone, string | undefined>
