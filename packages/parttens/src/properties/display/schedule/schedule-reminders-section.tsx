'use client'

import { BellIcon } from 'lucide-react'
import { resolveOptions } from '../../shared/lib/property-options'
import { PropertyMultiSelectShell } from '../../shared/property-multi-select-shell'
import type { SchedulePropertyLabels } from './schedule-labels'
import {
  type ScheduleReminderOption,
  type ScheduleValue,
  sortScheduleReminders,
} from './schedule-value'

export function ScheduleRemindersSection({
  labels,
  onChange,
  options,
  value,
}: Readonly<{
  labels: SchedulePropertyLabels
  onChange: (value: ScheduleValue) => void
  options: readonly ScheduleReminderOption[]
  value: ScheduleValue
}>) {
  const reminders = sortScheduleReminders(value.reminders, options)

  return (
    <div className="flex flex-col gap-2 p-2" data-slot="schedule-reminders">
      <PropertyMultiSelectShell
        addIcon={BellIcon}
        addLabel={labels.addReminder}
        ariaLabel={labels.reminders}
        emptyLabel={labels.noReminders}
        loadingLabel=""
        onChange={(next) =>
          onChange({
            ...value,
            reminders: sortScheduleReminders(next, options),
          })
        }
        options={options}
        placeholder={labels.addReminder}
        removeLabel={(option) => `${labels.removeReminder} ${option.label}`}
        renderOption={(option) => option.label}
        selectedOptions={resolveOptions(options, reminders)}
        value={reminders}
      />
    </div>
  )
}
