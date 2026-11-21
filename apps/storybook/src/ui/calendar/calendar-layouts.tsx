import type { DateRange, DropdownProps } from '@daypicker/react'
import {
  addDays,
  addMonths,
  addYears,
  formatLongDate,
  formatMediumDate,
  formatWeekdayAndDay,
} from '@tc96/helpers/date'
import { Button } from '@tc96/ui/button'
import { Calendar } from '@tc96/ui/calendar'
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from '@tc96/ui/combobox'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { Toggle } from '@tc96/ui/toggle'
import { ToggleGroup } from '@tc96/ui/toggle-group'
import { CalendarIcon } from 'lucide-react'
import { type ChangeEvent, useId, useState } from 'react'
import type { CalendarControls } from './calendar-controls.ts'

const roundedDayButtons = { day_button: 'rounded-full' }

const locale = 'en-US'

type CalendarLook = Omit<CalendarControls, 'mode'>

const lookProps = ({
  captionLayout,
  roundedDays,
  showOutsideDays,
}: CalendarLook) => ({
  captionLayout,
  classNames: roundedDays ? roundedDayButtons : undefined,
  showOutsideDays,
})

const SingleCalendar = (look: Readonly<CalendarLook>) => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Calendar
      {...lookProps(look)}
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  )
}

const MultipleCalendar = (look: Readonly<CalendarLook>) => {
  const today = new Date()
  const [date, setDate] = useState<Date[] | undefined>([
    addDays(today, -17),
    addDays(today, 2),
    addDays(today, 6),
    addDays(today, 8),
  ])
  return (
    <Calendar
      {...lookProps(look)}
      mode="multiple"
      onSelect={setDate}
      selected={date}
    />
  )
}

const RangeCalendar = (look: Readonly<CalendarLook>) => {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  return (
    <Calendar
      {...lookProps(look)}
      mode="range"
      onSelect={setRange}
      selected={range}
    />
  )
}

export const ComposedCalendar = ({
  mode,
  ...look
}: Readonly<CalendarControls>) => {
  if (mode === 'multiple') return <MultipleCalendar {...look} />
  if (mode === 'range') return <RangeCalendar {...look} />
  return <SingleCalendar {...look} />
}

export const PresetsCalendar = () => {
  const today = new Date()
  const presets = [
    { date: today, label: 'Today' },
    { date: addDays(today, -1), label: 'Yesterday' },
    { date: addDays(today, -7), label: 'Last week' },
    { date: addMonths(today, -1), label: 'Last month' },
    { date: addYears(today, -1), label: 'Last year' },
  ]
  const [month, setMonth] = useState(today)
  const [date, setDate] = useState<Date>(today)

  return (
    <div className="flex max-sm:flex-col">
      <div className="relative py-1 ps-1 max-sm:order-1 max-sm:border-t">
        <div className="flex h-full flex-col sm:border-e sm:pe-3">
          {presets.map((preset) => (
            <Button
              className="w-full justify-start"
              key={preset.label}
              onClick={() => {
                setDate(preset.date)
                setMonth(preset.date)
              }}
              size="sm"
              variant="ghost"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
      <Calendar
        className="max-sm:pb-3 sm:ps-5"
        classNames={roundedDayButtons}
        disabled={[{ after: today }]}
        mode="single"
        month={month}
        onMonthChange={setMonth}
        onSelect={(newDate) => {
          if (newDate) setDate(newDate)
        }}
        selected={date}
      />
    </div>
  )
}

export const PopoverRangeCalendar = () => {
  const [date, setDate] = useState<DateRange | undefined>()
  return (
    <Popover>
      <PopoverTrigger
        render={<Button className="w-full justify-start" variant="outline" />}
      >
        <CalendarIcon aria-hidden="true" />
        {date?.from ? (
          date.to ? (
            <>
              {formatMediumDate(date.from, locale)} -{' '}
              {formatMediumDate(date.to, locale)}
            </>
          ) : (
            formatMediumDate(date.from, locale)
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </PopoverTrigger>
      <PopoverPopup>
        <Calendar
          classNames={roundedDayButtons}
          defaultMonth={date?.from}
          mode="range"
          onSelect={setDate}
          selected={date}
        />
      </PopoverPopup>
    </Popover>
  )
}

const timeSlots = [
  { available: false, time: '09:00' },
  { available: false, time: '09:30' },
  { available: true, time: '10:00' },
  { available: true, time: '10:30' },
  { available: true, time: '11:00' },
  { available: true, time: '11:30' },
  { available: false, time: '12:00' },
  { available: true, time: '12:30' },
  { available: true, time: '13:00' },
  { available: true, time: '13:30' },
  { available: true, time: '14:00' },
  { available: false, time: '14:30' },
  { available: false, time: '15:00' },
  { available: true, time: '15:30' },
  { available: true, time: '16:00' },
  { available: true, time: '16:30' },
  { available: true, time: '17:00' },
  { available: true, time: '17:30' },
]

export const AppointmentPicker = () => {
  const today = new Date()
  const [date, setDate] = useState<Date>(today)
  const [time, setTime] = useState<string | null>(null)

  return (
    <div className="flex max-sm:flex-col">
      <Calendar
        className="max-sm:pb-3 sm:pe-5"
        classNames={roundedDayButtons}
        disabled={[{ before: today }]}
        mode="single"
        onSelect={(newDate) => {
          if (newDate) {
            setDate(newDate)
            setTime(null)
          }
        }}
        selected={date}
      />
      <div className="relative w-full max-sm:h-48 sm:w-40">
        <div className="absolute inset-0 max-sm:border-t">
          <ScrollArea
            className="h-full sm:border-s"
            overscrollContain
            scrollbarGutter
            scrollFade
          >
            <div className="flex flex-col gap-3 py-3 sm:pt-0 sm:pb-2">
              <div className="flex shrink-0 items-center font-medium text-sm sm:h-8 sm:px-5">
                {formatWeekdayAndDay(date, locale)}
              </div>
              <ToggleGroup
                className="grid w-full gap-1.5 max-sm:grid-cols-2 sm:px-5"
                onValueChange={(values) => setTime(values[0] || null)}
                value={time ? [time] : []}
              >
                {timeSlots.map(({ time: timeSlot, available }) => (
                  <Toggle
                    disabled={!available}
                    key={timeSlot}
                    size="sm"
                    value={timeSlot}
                    variant="outline"
                  >
                    {timeSlot}
                  </Toggle>
                ))}
              </ToggleGroup>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

interface DropdownItem {
  disabled?: boolean
  label: string
  value: string
}

const CalendarDropdown = ({
  'aria-label': ariaLabel,
  onChange,
  options,
  value,
}: DropdownProps) => {
  const items: DropdownItem[] =
    options?.map((option) => ({
      disabled: option.disabled,
      label: option.label,
      value: option.value.toString(),
    })) ?? []
  const selectedItem = items.find((item) => item.value === value?.toString())

  const handleValueChange = (newValue: DropdownItem | null) => {
    if (onChange && newValue) {
      onChange({
        target: { value: newValue.value },
      } as ChangeEvent<HTMLSelectElement>)
    }
  }

  return (
    <Combobox
      aria-label={ariaLabel}
      autoHighlight
      items={items}
      onValueChange={handleValueChange}
      value={selectedItem}
    >
      <ComboboxInput
        className="**:[input]:w-0 **:[input]:flex-1"
        onFocus={(event) => event.currentTarget.select()}
      />
      <ComboboxPopup aria-label={ariaLabel}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: DropdownItem) => (
            <ComboboxItem
              disabled={item.disabled}
              key={item.value}
              value={item}
            >
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  )
}

export const FieldDatePicker = () => {
  const [date, setDate] = useState<Date | undefined>()
  const id = useId()

  return (
    <Field>
      <FieldLabel htmlFor={id}>Start date</FieldLabel>
      <Popover>
        <PopoverTrigger
          id={id}
          render={<Button className="w-full justify-start" variant="outline" />}
        >
          <CalendarIcon aria-hidden="true" />
          {date ? formatLongDate(date, locale) : 'Pick a date'}
        </PopoverTrigger>
        <PopoverPopup>
          <Calendar
            captionLayout="dropdown"
            classNames={roundedDayButtons}
            components={{ Dropdown: CalendarDropdown }}
            defaultMonth={date}
            endMonth={new Date()}
            mode="single"
            onSelect={setDate}
            selected={date}
            startMonth={new Date(1900, 0)}
          />
        </PopoverPopup>
      </Popover>
    </Field>
  )
}
