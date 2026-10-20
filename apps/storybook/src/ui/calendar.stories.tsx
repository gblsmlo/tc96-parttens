import type { DateRange, DropdownProps } from '@daypicker/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
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
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../.storybook/docs-page.tsx'

const roundedDayButtons = { day_button: 'rounded-full' }

const locale = 'en-US'

const usage = `
import { Calendar } from '@acme/ui/calendar'

<Calendar classNames={{ day_button: 'rounded-full' }} />
`

const docs = {
  api: [
    {
      description: `A calendar component for date selection. This component wraps [@daypicker/react](https://daypicker.dev/) with custom styling.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`mode\` | \`"single"\`, \`"multiple"\` or \`"range"\` | \`"single"\` | Selection mode for the calendar |
| \`captionLayout\` | \`"label"\`, \`"dropdown"\`, \`"dropdown-months"\` or \`"dropdown-years"\` | \`"label"\` | Caption layout - use \`"dropdown"\` for month/year dropdowns |
| \`selected\` | \`Date\`, \`Date[]\` or \`DateRange\` | - | The selected date(s) |
| \`onSelect\` | \`(date) => void\` | - | Callback when date selection changes; receives a \`Date\`, \`Date[]\` or \`DateRange\` |
| \`showOutsideDays\` | \`boolean\` | \`true\` | Show days from adjacent months |
| \`startMonth\` | \`Date\` | - | First month to show in dropdown navigation |
| \`endMonth\` | \`Date\` | - | Last month to show in dropdown navigation |
| \`classNames\` | \`object\` | - | Custom class names for calendar parts |
| \`components\` | \`object\` | - | Custom components to override defaults |

Every calendar here passes \`classNames={{ day_button: 'rounded-full' }}\` for rounded day buttons. For the full list of props, see the [@daypicker/react documentation](https://daypicker.dev/).`,
      name: 'Calendar',
    },
  ],
  description: {
    component:
      'Calendar, unmodified, with rounded day buttons. A date picker component with range and multi-select support.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  component: Calendar,
  parameters: {
    a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
    docs,
  },
  title: 'UI/Calendar',
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

function BasicCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Calendar
      classNames={roundedDayButtons}
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  )
}

export const Basic: Story = {
  name: 'Basic Calendar',
  render: () => <BasicCalendar />,
}

export const BasicInteraction: Story = {
  ...Basic,
  name: 'Basic Calendar Interaction',
  play: async ({ canvasElement }) => {
    const dayButton = canvasElement.querySelector<HTMLElement>(
      '[data-selected] button',
    )
    if (!dayButton) throw new Error('The selected day did not render.')
    const { borderRadius, width } = getComputedStyle(dayButton)
    await expect(Number.parseFloat(borderRadius)).toBeGreaterThanOrEqual(
      Number.parseFloat(width) / 2,
    )

    const next = canvasElement.querySelector<HTMLElement>(
      'td:not([data-selected]):not([data-outside]):not([data-disabled]) button',
    )
    if (!next) throw new Error('No other day to pick.')
    await userEvent.click(next)
    await waitFor(() =>
      expect(next.closest('td')).toHaveAttribute('data-selected'),
    )
  },
  tags: interaction,
}

function DateRangeCalendar() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  return (
    <Calendar
      classNames={roundedDayButtons}
      mode="range"
      onSelect={setRange}
      selected={range}
    />
  )
}

export const DateRangeSelection: Story = {
  name: 'Calendar with date range selection',
  render: () => <DateRangeCalendar />,
}

function MultipleDatesCalendar() {
  const today = new Date()
  const [date, setDate] = useState<Date[] | undefined>([
    addDays(today, -17),
    addDays(today, 2),
    addDays(today, 6),
    addDays(today, 8),
  ])
  return (
    <Calendar
      classNames={roundedDayButtons}
      mode="multiple"
      onSelect={setDate}
      selected={date}
    />
  )
}

export const MultipleDateSelection: Story = {
  name: 'Calendar with multiple date selection',
  render: () => <MultipleDatesCalendar />,
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

function AppointmentPicker() {
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

export const TimeSlots: Story = {
  name: 'Calendar with time slots (appointment picker)',
  render: () => <AppointmentPicker />,
}

export const TimeSlotsInteraction: Story = {
  ...TimeSlots,
  name: 'Calendar with time slots Interaction',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slot = canvas.getByRole('button', { name: '10:00' })
    await userEvent.click(slot)
    await expect(slot).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: '09:00' })).toBeDisabled()
  },
  tags: interaction,
}

function PresetsCalendar() {
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

export const DatePresets: Story = {
  name: 'Calendar with date presets',
  render: () => <PresetsCalendar />,
}

export const DatePresetsInteraction: Story = {
  ...DatePresets,
  name: 'Calendar with date presets Interaction',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const lastWeek = addDays(new Date(), -7)
    await userEvent.click(canvas.getByRole('button', { name: 'Last week' }))
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-selected] button'),
      ).toHaveTextContent(String(lastWeek.getDate())),
    )
  },
  tags: interaction,
}

function DateRangePickerExample() {
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

export const DateRangePicker: Story = {
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  name: 'Date range picker',
  render: () => <DateRangePickerExample />,
}

export const DateRangePickerInteraction: Story = {
  ...DateRangePicker,
  name: 'Date range picker Interaction',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /Pick a date range/ })
    await userEvent.click(trigger)

    const grid = await screen.findByRole('grid')
    const days = grid.querySelectorAll<HTMLElement>(
      'td:not([data-outside]) button',
    )
    const [first, , third] = days
    if (!first || !third) throw new Error('The month did not render days.')
    await userEvent.click(first)
    await userEvent.click(third)
    await waitFor(() => expect(trigger).toHaveTextContent(' - '))

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
  tags: interaction,
}

interface DropdownItem {
  disabled?: boolean
  label: string
  value: string
}

function CalendarDropdown({
  'aria-label': ariaLabel,
  onChange,
  options,
  value,
}: DropdownProps) {
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

function FieldDatePicker() {
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

export const DatePickerWithFieldAndDropdownNavigation: Story = {
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  name: 'Date picker with field and dropdown navigation',
  render: () => <FieldDatePicker />,
}

export const DatePickerWithFieldAndDropdownNavigationInteraction: Story = {
  ...DatePickerWithFieldAndDropdownNavigation,
  name: 'Date picker with field and dropdown navigation Interaction',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /Start date/ })
    await userEvent.click(trigger)

    const grid = await screen.findByRole('grid')
    await expect(screen.getAllByRole('combobox')).toHaveLength(2)
    const day = grid.querySelector<HTMLElement>(
      'td:not([data-outside]):not([data-disabled]) button',
    )
    if (!day) throw new Error('The month did not render days.')
    await userEvent.click(day)
    await waitFor(() => expect(trigger).not.toHaveTextContent('Pick a date'))

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
  tags: interaction,
}
