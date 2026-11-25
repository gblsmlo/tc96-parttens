'use client'

import type { DayPickerLocale } from '@daypicker/react'
import type { PropertyCalendarProps } from '../../shared/property-calendar-popover'
import type { PropertyOption } from '../../shared/property-catalog'
import type { SchedulePropertyLabels } from '../../shared/property-labels'
import { DateProperty } from '../date/date-property'
import { SelectProperty } from '../select/select-property'
import type { ScheduleValue } from './schedule-value'

export function ScheduleRecurrenceSection({
  calendarLocale,
  calendarProps,
  labels,
  locale,
  onChange,
  options,
  value,
}: Readonly<{
  calendarLocale?: DayPickerLocale
  calendarProps?: PropertyCalendarProps
  labels: SchedulePropertyLabels
  locale: string
  onChange: (value: ScheduleValue) => void
  options: readonly PropertyOption[]
  value: ScheduleValue
}>) {
  return (
    <div className="flex flex-col gap-2 p-2" data-slot="schedule-recurrence">
      <div className="flex h-8 items-center justify-between gap-2 text-sm">
        {labels.frequency}
        <SelectProperty
          allowEmpty
          ariaLabel={labels.frequency}
          labels={{ emptyOption: labels.noRepeat }}
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
            calendarLocale={calendarLocale}
            calendarProps={calendarProps}
            labels={{
              clear: labels.clearUntil,
              fallback: labels.untilFallback,
            }}
            locale={locale}
            onValueChange={(until) => onChange({ ...value, until })}
            value={value.until}
          />
        </div>
      ) : null}
    </div>
  )
}
