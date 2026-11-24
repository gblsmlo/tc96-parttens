import { ptBR } from '@daypicker/react/locale'
import { CalendarDotsIcon } from '@phosphor-icons/react'
import { DateProperty, type DatePropertyProps } from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Calendar } from '@tc96/ui/calendar'
import { Input } from '@tc96/ui/input'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { useState } from 'react'
import type { DateControls } from './date-controls.ts'

export type StatefulDateProps = Omit<DatePropertyProps, 'onValueChange'>

export function StatefulDate({
  value: initialValue,
  ...props
}: Readonly<StatefulDateProps>) {
  const [value, setValue] = useState(initialValue)

  return <DateProperty {...props} onValueChange={setValue} value={value} />
}

export const ComposedDate = ({
  calendarLocale,
  displayLabel,
  value,
  ...props
}: Readonly<DateControls>) => (
  <StatefulDate
    {...props}
    calendarLocale={calendarLocale === 'ptBR' ? ptBR : undefined}
    displayLabel={displayLabel || undefined}
    key={value}
    timeZone="UTC"
    value={value || null}
  />
)

const parseDateTime = (value: string | null) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDateTimeLabel = (value: string | null, fallback: string) => {
  const date = parseDateTime(value)
  if (!date) return fallback
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date)
}

const formatTimeInput = (date: Date) =>
  `${date.getUTCHours().toString().padStart(2, '0')}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}`

const serializeDateTime = (date: Date, time: string) => {
  const [hours = '00', minutes = '00'] = time.split(':')
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      Number(hours),
      Number(minutes),
    ),
  ).toISOString()
}

export function DateAndTimeBadge({
  initialValue,
}: Readonly<{ initialValue: string }>) {
  const [value, setValue] = useState<string | null>(initialValue)
  const selected = parseDateTime(value) ?? new Date(initialValue)
  const [draftDate, setDraftDate] = useState(selected)
  const [draftTime, setDraftTime] = useState(formatTimeInput(selected))
  const label = formatDateTimeLabel(value, 'Schedule')

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Schedule: ${label}`}
        render={
          <Badge
            className="max-w-full"
            render={<button type="button" />}
            variant="secondary"
          />
        }
      >
        <CalendarDotsIcon aria-hidden className="size-3" />
        <span className="truncate">{label}</span>
      </PopoverTrigger>
      <PopoverPopup
        align="start"
        className="w-auto"
        side="bottom"
        sideOffset={8}
      >
        <Calendar
          defaultMonth={draftDate}
          mode="single"
          onSelect={(date) => {
            if (!date) return
            setDraftDate(date)
            setValue(serializeDateTime(date, draftTime))
          }}
          selected={draftDate}
        />
        <div className="grid gap-2 border-t p-2">
          <label
            className="grid gap-1 px-1 text-sm"
            htmlFor="date-and-time-input"
          >
            <span className="font-medium text-muted-foreground text-xs">
              Time
            </span>
            <Input
              aria-label="Schedule time"
              id="date-and-time-input"
              nativeInput
              onChange={(event) => {
                const time = event.currentTarget.value
                setDraftTime(time)
                setValue(serializeDateTime(draftDate, time))
              }}
              type="time"
              value={draftTime}
            />
          </label>
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate px-1 text-muted-foreground text-sm">
              {label}
            </span>
            <Button
              onClick={() => setValue(null)}
              size="sm"
              type="button"
              variant="ghost"
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  )
}
