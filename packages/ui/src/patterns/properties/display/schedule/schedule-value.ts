export interface ScheduleValue {
  allDay: boolean
  endTime: string
  frequency: string | null
  from: Date | null
  reminders: readonly string[]
  startTime: string
  until: string | null
}

export const emptyScheduleValue: ScheduleValue = {
  allDay: true,
  endTime: '',
  frequency: null,
  from: null,
  reminders: [],
  startTime: '',
  until: null,
}

export interface ScheduleRecurrenceOption {
  label: string
  value: string
}

export const defaultScheduleRecurrenceOptions: readonly ScheduleRecurrenceOption[] =
  [
    { label: 'Diariamente', value: 'daily' },
    { label: 'Dias úteis', value: 'weekdays' },
    { label: 'Semanalmente', value: 'weekly' },
    { label: 'Mensalmente', value: 'monthly' },
    { label: 'Anualmente', value: 'yearly' },
  ]

export interface ScheduleReminderOption {
  label: string
  value: string
}

export const defaultScheduleReminderOptions: readonly ScheduleReminderOption[] =
  [
    { label: '10 min antes', value: '10' },
    { label: '30 min antes', value: '30' },
    { label: '1 hora antes', value: '60' },
    { label: '1 dia antes', value: '1440' },
  ]

export function sortScheduleReminders(
  reminders: readonly string[],
  options: readonly ScheduleReminderOption[],
): string[] {
  const rank = (reminder: string) => {
    const index = options.findIndex((option) => option.value === reminder)
    return index === -1 ? options.length : index
  }

  return [...reminders].sort((left, right) => rank(left) - rank(right))
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addLocalDays(date: Date, days: number): Date {
  const next = startOfLocalDay(date)
  next.setDate(next.getDate() + days)
  return next
}

export function formatScheduleDay(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })
    .format(date)
    .replaceAll('.', '')
}

export function formatScheduleProperty(
  value: ScheduleValue,
  fallback: string,
  locale: string,
): string {
  if (!value.from) return fallback

  const parts = [formatScheduleDay(value.from, locale)]
  if (!value.allDay && value.startTime) {
    parts.push(
      value.endTime ? `${value.startTime} – ${value.endTime}` : value.startTime,
    )
  }

  return parts.join(' · ')
}

export function scheduleRecurrenceLabel(
  frequency: string | null,
  options: readonly ScheduleRecurrenceOption[],
): string | null {
  if (!frequency) return null
  return options.find((option) => option.value === frequency)?.label ?? null
}
