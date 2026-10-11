'use client'

import type { PropertyCalendarProps } from '../../shared/property-calendar-popover'
import { DateProperty } from '../date/date-property'
import { SelectProperty } from '../select/select-property'
import type { SchedulePropertyLabels } from './schedule-labels'
import type { ScheduleRecurrenceOption, ScheduleValue } from './schedule-value'

export function ScheduleRecurrenceSection({
  calendarProps,
  labels,
  locale,
  onChange,
  options,
  value,
}: Readonly<{
  calendarProps?: PropertyCalendarProps
  labels: SchedulePropertyLabels
  locale: string
  onChange: (value: ScheduleValue) => void
  options: readonly ScheduleRecurrenceOption[]
  value: ScheduleValue
}>) {
  return (
    <div className="flex flex-col gap-2 p-2" data-slot="schedule-recurrence">
      <div className="flex h-8 items-center justify-between gap-2 text-sm">
        {labels.repeat}
        <SelectProperty
          ariaLabel={labels.frequency}
          emptyOptionLabel={labels.noRepeat}
          onValueChange={(frequency) =>
            onChange({
              ...value,
              frequency: frequency || null,
              until: frequency ? value.until : null,
            })
          }
          options={options}
          placeholder={labels.noRepeat}
          value={value.frequency}
        />
      </div>
      {value.frequency ? (
        <div className="flex h-8 items-center justify-between gap-2 text-sm">
          {labels.until}
          <DateProperty
            ariaLabel={labels.until}
            calendarProps={calendarProps}
            fallback={labels.untilFallback}
            locale={locale}
            onValueChange={(until) => onChange({ ...value, until })}
            value={value.until}
          />
        </div>
      ) : null}
    </div>
  )
}
