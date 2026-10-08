'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Switch } from '@tc96/ui/switch'
import { ClockIcon } from 'lucide-react'
import { useId } from 'react'
import { propertySelectItemClassName } from '../../shared/property-select-shell'
import type { SchedulePropertyLabels } from './schedule-labels'
import type { ScheduleValue } from './schedule-value'

export type ScheduleTimeControl = 'select' | 'input'

const QUARTER_HOUR_SECONDS = 900

const quarterHourSlots = Array.from({ length: 96 }, (_, index) => {
  const hours = String(Math.floor(index / 4)).padStart(2, '0')
  const minutes = String((index % 4) * 15).padStart(2, '0')
  return `${hours}:${minutes}`
})

interface TimeControlProps {
  disabled: boolean
  label: string
  onChange: (time: string) => void
  value: string
}

function TimeSelect({
  disabled,
  label,
  onChange,
  value,
}: Readonly<TimeControlProps>) {
  return (
    <Select
      disabled={disabled}
      onValueChange={(time) => onChange(time ?? '')}
      value={value || null}
    >
      <SelectTrigger aria-label={label} className="w-full min-w-0">
        <ClockIcon aria-hidden className="size-4 opacity-80" />
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectPopup className="max-h-64">
        {quarterHourSlots.map((slot) => (
          <SelectItem
            className={propertySelectItemClassName}
            key={slot}
            value={slot}
          >
            {slot}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

function TimeField({
  disabled,
  label,
  onChange,
  value,
}: Readonly<TimeControlProps>) {
  return (
    <InputGroup className="grow">
      <InputGroupInput
        aria-label={label}
        className="*:[input]:[&::-webkit-calendar-picker-indicator]:hidden"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        step={QUARTER_HOUR_SECONDS}
        type="time"
        value={value}
      />
      <InputGroupAddon>
        <ClockIcon aria-hidden />
      </InputGroupAddon>
    </InputGroup>
  )
}

export function ScheduleTimeSection({
  labels,
  onChange,
  timeControl,
  value,
}: Readonly<{
  labels: SchedulePropertyLabels
  onChange: (value: ScheduleValue) => void
  timeControl: ScheduleTimeControl
  value: ScheduleValue
}>) {
  const Control = timeControl === 'select' ? TimeSelect : TimeField
  const allDayLabelId = useId()

  return (
    <div className="flex flex-col gap-2 p-2" data-slot="schedule-time">
      <div className="grid grid-cols-2 gap-2 *:min-w-0">
        <Control
          disabled={value.allDay}
          label={labels.start}
          onChange={(startTime) => onChange({ ...value, startTime })}
          value={value.startTime}
        />
        <Control
          disabled={value.allDay}
          label={labels.end}
          onChange={(endTime) => onChange({ ...value, endTime })}
          value={value.endTime}
        />
      </div>
      <div className="flex h-8 items-center justify-between text-sm">
        <span id={allDayLabelId}>{labels.allDay}</span>
        <Switch
          aria-labelledby={allDayLabelId}
          checked={value.allDay}
          onCheckedChange={(allDay) =>
            onChange({
              ...value,
              allDay,
              endTime: allDay ? '' : value.endTime,
              startTime: allDay ? '' : value.startTime,
            })
          }
        />
      </div>
    </div>
  )
}
