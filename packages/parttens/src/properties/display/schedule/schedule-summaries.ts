import { formatDateProperty } from '../date/date-value'
import type { SchedulePropertyLabels } from './schedule-labels'
import type { ScheduleSection } from './schedule-section'
import {
  type ScheduleRecurrenceOption,
  type ScheduleReminderOption,
  type ScheduleValue,
  scheduleRecurrenceLabel,
  sortScheduleReminders,
} from './schedule-value'

export interface ScheduleSummary {
  filled: boolean
  text: string
}

export interface ScheduleSummaryContext {
  labels: SchedulePropertyLabels
  locale: string
  recurrenceOptions: readonly ScheduleRecurrenceOption[]
  reminderOptions: readonly ScheduleReminderOption[]
  value: ScheduleValue
}

function timeSummary({ labels, value }: ScheduleSummaryContext) {
  if (value.allDay || !value.startTime) {
    return { filled: false, text: labels.allDay }
  }

  return {
    filled: true,
    text: value.endTime
      ? `${value.startTime} – ${value.endTime}`
      : value.startTime,
  }
}

function repeatSummary({
  labels,
  locale,
  recurrenceOptions,
  value,
}: ScheduleSummaryContext) {
  const frequency = scheduleRecurrenceLabel(value.frequency, recurrenceOptions)
  if (!frequency) return { filled: false, text: labels.noRepeat }

  const until = formatDateProperty(value.until, '', locale, 'UTC')
  return {
    filled: true,
    text: until ? `${frequency} · ${labels.until} ${until}` : frequency,
  }
}

function remindersSummary({
  labels,
  reminderOptions,
  value,
}: ScheduleSummaryContext) {
  const names = sortScheduleReminders(value.reminders, reminderOptions)
    .map(
      (reminder) =>
        reminderOptions.find((option) => option.value === reminder)?.label,
    )
    .filter((name): name is string => Boolean(name))

  const [first, ...rest] = names
  if (first === undefined) return { filled: false, text: labels.addReminder }

  return {
    filled: true,
    text: rest.length ? `${first} +${rest.length}` : first,
  }
}

export function scheduleSectionSummary(
  section: ScheduleSection,
  context: ScheduleSummaryContext,
): ScheduleSummary {
  if (section === 'time') return timeSummary(context)
  if (section === 'repeat') return repeatSummary(context)
  return remindersSummary(context)
}
