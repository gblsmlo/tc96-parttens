import type { DateRange } from '@daypicker/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { addDays, formatLongDate } from '@tc96/helpers/date'
import { Button } from '@tc96/ui/button'
import { Calendar } from '@tc96/ui/calendar'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { expect, within } from 'storybook/test'
import { DatePickerCanvas } from './date-picker-frame.tsx'
import {
  formatRange,
  locale,
  PresetColumn,
  popupLabels,
} from './date-picker-layouts.tsx'

const triggerButton = (
  <Button className="w-full justify-start" variant="outline" />
)

function DueDatePicker() {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 11, 4))

  return (
    <Field>
      <FieldLabel htmlFor={id}>Due date</FieldLabel>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger id={id} render={triggerButton}>
          <CalendarIcon aria-hidden="true" />
          {date ? formatLongDate(date, locale) : 'No due date'}
        </PopoverTrigger>
        <PopoverPopup aria-label="Choose a due date">
          <Calendar
            defaultMonth={date}
            mode="single"
            onSelect={(value) => {
              setDate(value)
              setOpen(false)
            }}
            selected={date}
          />
        </PopoverPopup>
      </Popover>
      <FieldDescription>
        Assignees get a reminder the day before.
      </FieldDescription>
    </Field>
  )
}

function StayPicker() {
  const id = useId()
  const [stay, setStay] = useState<DateRange | undefined>({
    from: new Date(2026, 6, 10),
    to: new Date(2026, 6, 14),
  })

  return (
    <Field>
      <FieldLabel htmlFor={id}>Check-in and check-out</FieldLabel>
      <Popover>
        <PopoverTrigger id={id} render={triggerButton}>
          <CalendarIcon aria-hidden="true" />
          {formatRange(stay) ?? 'Add dates'}
        </PopoverTrigger>
        <PopoverPopup aria-label="Choose your stay">
          <Calendar
            defaultMonth={stay?.from}
            mode="range"
            numberOfMonths={2}
            onSelect={setStay}
            selected={stay}
          />
        </PopoverPopup>
      </Popover>
    </Field>
  )
}

function BirthDatePicker() {
  const id = useId()
  const [today] = useState(() => new Date())
  const [date, setDate] = useState<Date | undefined>()

  return (
    <Field>
      <FieldLabel htmlFor={id}>Date of birth</FieldLabel>
      <Popover>
        <PopoverTrigger id={id} render={triggerButton}>
          <CalendarIcon aria-hidden="true" />
          {date ? formatLongDate(date, locale) : 'Select your date of birth'}
        </PopoverTrigger>
        <PopoverPopup aria-label="Choose your date of birth">
          <Calendar
            captionLayout="dropdown"
            defaultMonth={date ?? new Date(1990, 0)}
            disabled={{ after: today }}
            endMonth={today}
            mode="single"
            onSelect={setDate}
            selected={date}
            startMonth={new Date(1900, 0)}
          />
        </PopoverPopup>
      </Popover>
      <FieldDescription>Used to confirm your identity.</FieldDescription>
    </Field>
  )
}

const reportDay = new Date(2026, 10, 20)

function ReportPeriodPicker() {
  const id = useId()
  const today = reportDay
  const presets = [
    { label: 'Last 7 days', value: { from: addDays(today, -6), to: today } },
    { label: 'Last 30 days', value: { from: addDays(today, -29), to: today } },
    { label: 'Last 90 days', value: { from: addDays(today, -89), to: today } },
  ]
  const [period, setPeriod] = useState<DateRange | undefined>(presets[1]?.value)
  const [month, setMonth] = useState(today)

  return (
    <Field>
      <FieldLabel htmlFor={id}>Report period</FieldLabel>
      <Popover>
        <PopoverTrigger id={id} render={triggerButton}>
          <CalendarIcon aria-hidden="true" />
          {formatRange(period) ?? 'Choose a period'}
        </PopoverTrigger>
        <PopoverPopup aria-label={popupLabels.range}>
          <PresetColumn
            calendar={
              <Calendar
                className="max-sm:pb-3 sm:ps-2"
                disabled={{ after: today }}
                mode="range"
                month={month}
                onMonthChange={setMonth}
                onSelect={setPeriod}
                selected={period}
                today={today}
              />
            }
          >
            {presets.map((preset) => (
              <Button
                className="w-full justify-start"
                key={preset.label}
                onClick={() => {
                  setPeriod(preset.value)
                  setMonth(preset.value.to)
                }}
                size="sm"
                variant="ghost"
              >
                {preset.label}
              </Button>
            ))}
          </PresetColumn>
        </PopoverPopup>
      </Popover>
    </Field>
  )
}

const meta = {
  decorators: [DatePickerCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/DatePicker/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DueDate: Story = {
  render: () => <DueDatePicker />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Due date' }),
    ).toHaveTextContent('December 4, 2026')
  },
}

export const HotelStay: Story = {
  render: () => <StayPicker />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Check-in and check-out',
      }),
    ).toHaveTextContent('Jul 10, 2026 - Jul 14, 2026')
  },
}

export const DateOfBirth: Story = {
  render: () => <BirthDatePicker />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Date of birth' }),
    ).toHaveTextContent('Select your date of birth')
  },
}

export const ReportPeriod: Story = {
  render: () => <ReportPeriodPicker />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Report period' }),
    ).toHaveTextContent('Oct 22, 2026 - Nov 20, 2026')
  },
}
