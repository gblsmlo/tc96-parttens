import type { LucideIcon } from 'lucide-react'
import { BellIcon, ClockIcon, RepeatIcon } from 'lucide-react'
import type { PropertyCalendarProps } from '../../shared/property-calendar-popover'
import type { SchedulePropertyLabels } from './schedule-labels'
import type { ScheduleTimeControl } from './schedule-time-section'
import type {
  ScheduleRecurrenceOption,
  ScheduleReminderOption,
  ScheduleValue,
} from './schedule-value'

export type ScheduleSection = 'time' | 'repeat' | 'reminders'

export type ScheduleFooterLayout = 'rows' | 'drill-in'

export const scheduleSections: readonly ScheduleSection[] = [
  'time',
  'repeat',
  'reminders',
]

export const scheduleSectionIcons: Readonly<
  Record<ScheduleSection, LucideIcon>
> = {
  reminders: BellIcon,
  repeat: RepeatIcon,
  time: ClockIcon,
}

export function scheduleSectionLabel(
  labels: SchedulePropertyLabels,
  section: ScheduleSection,
): string {
  if (section === 'time') return labels.time
  if (section === 'repeat') return labels.repeat
  return labels.reminders
}

export interface ScheduleEditorProps {
  labels: SchedulePropertyLabels
  locale: string
  onChange: (value: ScheduleValue) => void
  recurrenceOptions: readonly ScheduleRecurrenceOption[]
  reminderOptions: readonly ScheduleReminderOption[]
  timeControl: ScheduleTimeControl
  value: ScheduleValue
  calendarProps?: PropertyCalendarProps
}

export interface ScheduleFooterProps extends ScheduleEditorProps {
  active: ScheduleSection | null
  enabled: Readonly<Record<ScheduleSection, boolean>>
  onSelect: (section: ScheduleSection) => void
}
