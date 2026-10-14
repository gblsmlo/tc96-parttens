'use client'

import { ScheduleRecurrenceSection } from './schedule-recurrence-section'
import { ScheduleRemindersSection } from './schedule-reminders-section'
import type { ScheduleEditorProps, ScheduleSection } from './schedule-section'
import { ScheduleTimeSection } from './schedule-time-section'

export function ScheduleSectionEditor({
  calendarProps,
  labels,
  locale,
  onChange,
  recurrenceOptions,
  reminderOptions,
  section,
  timeControl,
  value,
}: Readonly<ScheduleEditorProps & { section: ScheduleSection }>) {
  if (section === 'time') {
    return (
      <ScheduleTimeSection
        labels={labels}
        onChange={onChange}
        timeControl={timeControl}
        value={value}
      />
    )
  }

  if (section === 'repeat') {
    return (
      <ScheduleRecurrenceSection
        calendarProps={calendarProps}
        labels={labels}
        locale={locale}
        onChange={onChange}
        options={recurrenceOptions}
        value={value}
      />
    )
  }

  return (
    <ScheduleRemindersSection
      labels={labels}
      onChange={onChange}
      options={reminderOptions}
      value={value}
    />
  )
}
