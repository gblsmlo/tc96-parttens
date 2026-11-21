import type { DateRange } from '@daypicker/react'
import {
  addDays,
  formatLongDate,
  formatMediumDate,
  isValidDate,
  parseDateValue,
} from '@tc96/helpers/date'
import { Button } from '@tc96/ui/button'
import { Calendar } from '@tc96/ui/calendar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { CalendarIcon } from 'lucide-react'
import {
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import type { DatePickerControls } from './date-picker-controls.ts'

export type DatePickerValue = Date | DateRange | undefined

type PopoverRootProps = ComponentProps<typeof Popover>

export type DatePickerOpenChange = NonNullable<PopoverRootProps['onOpenChange']>

type PopoverActions = NonNullable<
  NonNullable<PopoverRootProps['actionsRef']>['current']
>

interface DatePickerCallbacks {
  onOpenChange?: DatePickerOpenChange
  onSelect?: (value: DatePickerValue) => void
}

interface ComposedDatePickerProps
  extends DatePickerControls,
    DatePickerCallbacks {
  closeOnSelect?: boolean
}

interface InputDatePickerProps extends DatePickerCallbacks {
  defaultOpen?: boolean
}

interface Preset<T> {
  label: string
  value: T
}

interface PresetColumnProps {
  calendar: ReactNode
  children: ReactNode
}

export const locale = 'en-US'

export const sampleToday = new Date(2026, 2, 27)

export const sampleDate = new Date(2026, 2, 12)

export const sampleRange: DateRange = {
  from: sampleDate,
  to: new Date(2026, 2, 18),
}

export const popupLabels = {
  range: 'Choose a date range',
  single: 'Choose a date',
} as const

export const singlePresets = (today: Date): Preset<Date>[] => [
  { label: 'Today', value: today },
  { label: 'Tomorrow', value: addDays(today, 1) },
  { label: 'In 3 days', value: addDays(today, 3) },
  { label: 'In a week', value: addDays(today, 7) },
]

export const rangePresets = (today: Date): Preset<DateRange>[] => [
  { label: 'Next 7 days', value: { from: today, to: addDays(today, 6) } },
  { label: 'Next 14 days', value: { from: today, to: addDays(today, 13) } },
  { label: 'Next 30 days', value: { from: today, to: addDays(today, 29) } },
]

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

export const formatRange = (range: DateRange | undefined) => {
  if (!range?.from) return undefined
  const start = formatMediumDate(range.from, locale)
  if (!range.to || isSameDay(range.from, range.to)) return start
  return `${start} - ${formatMediumDate(range.to, locale)}`
}

export const toInputValue = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

export const PresetColumn = ({
  calendar,
  children,
}: Readonly<PresetColumnProps>) => (
  <div className="flex max-sm:flex-col">
    <div className="relative py-1 ps-1 max-sm:order-1 max-sm:border-t">
      <div className="flex h-full flex-col sm:border-e sm:pe-3">{children}</div>
    </div>
    {calendar}
  </div>
)

const DatePickerState = ({
  captionLayout,
  closeOnSelect = false,
  defaultOpen,
  icon,
  mode,
  onOpenChange,
  onSelect,
  placeholder,
  presets,
  selected,
}: Readonly<ComposedDatePickerProps>) => {
  const actionsRef = useRef<PopoverActions>(null)
  const [open, setOpen] = useState(defaultOpen)
  const [date, setDate] = useState<Date | undefined>(
    selected ? sampleDate : undefined,
  )
  const [range, setRange] = useState<DateRange | undefined>(sampleRange)
  const [month, setMonth] = useState<Date>(sampleDate)

  const close = () => actionsRef.current?.close()

  const pickDate = (value: Date | undefined) => {
    setDate(value)
    onSelect?.(value)
    if (closeOnSelect && value) close()
  }

  const pickRange = (value: DateRange | undefined) => {
    setRange(value)
    onSelect?.(value)
    if (
      closeOnSelect &&
      value?.from &&
      value.to &&
      !isSameDay(value.from, value.to)
    )
      close()
  }

  const calendarProps = {
    captionLayout,
    className: presets ? 'max-sm:pb-3 sm:ps-2' : undefined,
    month,
    onMonthChange: setMonth,
    today: sampleToday,
  }

  const calendar =
    mode === 'range' ? (
      <Calendar
        {...calendarProps}
        mode="range"
        onSelect={pickRange}
        selected={range}
      />
    ) : (
      <Calendar
        {...calendarProps}
        mode="single"
        onSelect={pickDate}
        selected={date}
      />
    )

  const value =
    mode === 'range'
      ? formatRange(range)
      : date
        ? formatLongDate(date, locale)
        : undefined

  return (
    <Popover
      actionsRef={actionsRef}
      onOpenChange={(next, eventDetails) => {
        setOpen(next)
        onOpenChange?.(next, eventDetails)
      }}
      open={open}
    >
      <PopoverTrigger
        render={<Button className="w-full justify-start" variant="outline" />}
      >
        {icon ? <CalendarIcon aria-hidden="true" /> : null}
        {value ?? placeholder}
      </PopoverTrigger>
      <PopoverPopup aria-label={popupLabels[mode]}>
        {presets ? (
          <PresetColumn calendar={calendar}>
            {mode === 'range'
              ? rangePresets(sampleToday).map((preset) => (
                  <Button
                    className="w-full justify-start"
                    key={preset.label}
                    onClick={() => {
                      setMonth(preset.value.from ?? sampleToday)
                      pickRange(preset.value)
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    {preset.label}
                  </Button>
                ))
              : singlePresets(sampleToday).map((preset) => (
                  <Button
                    className="w-full justify-start"
                    key={preset.label}
                    onClick={() => {
                      setMonth(preset.value)
                      pickDate(preset.value)
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    {preset.label}
                  </Button>
                ))}
          </PresetColumn>
        ) : (
          calendar
        )}
      </PopoverPopup>
    </Popover>
  )
}

export const ComposedDatePicker = (
  props: Readonly<ComposedDatePickerProps>,
) => (
  <DatePickerState
    key={`${props.mode}-${props.defaultOpen}-${props.selected}`}
    {...props}
  />
)

export const InputDatePicker = ({
  defaultOpen = false,
  onOpenChange,
  onSelect,
}: Readonly<InputDatePickerProps>) => {
  const [date, setDate] = useState<Date | undefined>()
  const [inputValue, setInputValue] = useState('')
  const [month, setMonth] = useState<Date>(sampleDate)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setInputValue(value)
    if (!value) {
      setDate(undefined)
      return
    }
    const parsed = parseDateValue(value)
    if (isValidDate(parsed)) {
      setDate(parsed)
      setMonth(parsed)
    }
  }

  const handleSelect = (value: Date | undefined) => {
    setDate(value)
    setInputValue(value ? toInputValue(value) : '')
    if (value) setMonth(value)
    onSelect?.(value)
  }

  return (
    <Popover defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <InputGroup>
        <InputGroupInput
          aria-label="Date"
          className="*:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={handleInputChange}
          onClick={(event) => event.stopPropagation()}
          type="date"
          value={inputValue}
        />
        <InputGroupAddon>
          <PopoverTrigger
            aria-label="Open calendar"
            render={<Button size="icon-xs" variant="ghost" />}
          >
            <CalendarIcon aria-hidden="true" />
          </PopoverTrigger>
        </InputGroupAddon>
      </InputGroup>
      <PopoverPopup
        align="start"
        alignOffset={-4}
        aria-label={popupLabels.single}
        sideOffset={8}
      >
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onSelect={handleSelect}
          selected={date}
          today={sampleToday}
        />
      </PopoverPopup>
    </Popover>
  )
}
