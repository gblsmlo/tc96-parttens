import type { Meta, StoryObj } from '@storybook/react-vite'
import { addDays, formatLongDate, formatMediumDate } from '@tc96/helpers/date'
import {
  expect,
  fireEvent,
  fn,
  screen,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { datePickerControlArgs } from './date-picker-controls.ts'
import { DatePickerCanvas } from './date-picker-frame.tsx'
import {
  ComposedDatePicker,
  type DatePickerOpenChange,
  type DatePickerValue,
  InputDatePicker,
  locale,
  popupLabels,
  sampleToday,
} from './date-picker-layouts.tsx'

interface BehaviorArgs {
  onOpenChange: DatePickerOpenChange
  onSelect: (value: DatePickerValue) => void
}

const { placeholder } = datePickerControlArgs

const monthLabel = (date: Date) =>
  new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    date,
  )

const march = (day: number) => new Date(2026, 2, day)

const findPopup = (name: string = popupLabels.single) =>
  screen.findByRole('dialog', { name })

const closePopup = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const dayButton = (grid: HTMLElement, day: number) => {
  const button = [
    ...grid.querySelectorAll<HTMLElement>('td:not([data-outside]) button'),
  ].find((item) => item.textContent === String(day))
  if (!button) throw new Error(`Day ${day} did not render.`)
  return button
}

const meta = {
  args: { onOpenChange: fn(), onSelect: fn() },
  argTypes: {
    onOpenChange: { control: false },
    onSelect: { control: false },
  },
  decorators: [DatePickerCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/DatePicker/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDatePicker
      {...datePickerControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: placeholder,
    })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(trigger)
    const popup = await findPopup()
    await waitFor(() => expect(within(popup).getByRole('grid')).toBeVisible())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await closePopup()
  },
}

export const PickedDateInTrigger: Story = {
  render: ({ onSelect }) => (
    <ComposedDatePicker {...datePickerControlArgs} onSelect={onSelect} />
  ),
  play: async ({ args, canvasElement }) => {
    const grid = within(await findPopup()).getByRole('grid')
    await expect(grid).toHaveAccessibleName('March 2026')
    const day = dayButton(grid, 1)
    await userEvent.click(day)
    await waitFor(() =>
      expect(
        within(canvasElement).getByRole('button', {
          name: formatLongDate(march(1), locale),
        }),
      ).toBeVisible(),
    )
    await expect(day.closest('td')).toHaveAttribute('data-selected')
    await expect(args.onSelect).toHaveBeenCalledWith(march(1))
    await closePopup()
  },
}

export const StaysOpenAfterPick: Story = {
  render: () => <ComposedDatePicker {...datePickerControlArgs} />,
  play: async ({ canvasElement }) => {
    const popup = await findPopup()
    await userEvent.click(dayButton(within(popup).getByRole('grid'), 2))
    await waitFor(() =>
      expect(
        within(canvasElement).getByRole('button', {
          name: formatLongDate(march(2), locale),
        }),
      ).toHaveAttribute('aria-expanded', 'true'),
    )
    await expect(popup).toBeVisible()
    await closePopup()
  },
}

export const ClosesOnSelect: Story = {
  render: ({ onOpenChange, onSelect }) => (
    <ComposedDatePicker
      {...datePickerControlArgs}
      closeOnSelect
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const popup = await findPopup()
    await userEvent.click(dayButton(within(popup).getByRole('grid'), 3))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onSelect).toHaveBeenCalledWith(march(3))
    await expect(args.onOpenChange).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'imperative-action' }),
    )
    await expect(
      within(canvasElement).getByRole('button', {
        name: formatLongDate(march(3), locale),
      }),
    ).toHaveAttribute('aria-expanded', 'false')
  },
}

export const RangeInTrigger: Story = {
  render: ({ onSelect }) => (
    <ComposedDatePicker
      {...datePickerControlArgs}
      mode="range"
      onSelect={onSelect}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const grid = within(await findPopup(popupLabels.range)).getByRole('grid')
    const trigger = within(canvasElement).getByRole('button')
    const start = formatMediumDate(march(12), locale)
    await expect(trigger).toHaveTextContent(
      `${start} - ${formatMediumDate(march(18), locale)}`,
    )
    await userEvent.click(dayButton(grid, 12))
    await waitFor(() =>
      expect(args.onSelect).toHaveBeenLastCalledWith({
        from: march(12),
        to: march(12),
      }),
    )
    await expect(trigger).toHaveTextContent(start)
    await expect(trigger).not.toHaveTextContent(' - ')
    await userEvent.click(dayButton(grid, 15))
    await waitFor(() =>
      expect(trigger).toHaveTextContent(
        `${start} - ${formatMediumDate(march(15), locale)}`,
      ),
    )
    await expect(args.onSelect).toHaveBeenLastCalledWith({
      from: march(12),
      to: march(15),
    })
    await closePopup()
  },
}

export const ClosesOnRangeEnd: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDatePicker
      {...datePickerControlArgs}
      closeOnSelect
      mode="range"
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args }) => {
    const popup = await findPopup(popupLabels.range)
    const grid = within(popup).getByRole('grid')
    await userEvent.click(dayButton(grid, 12))
    await waitFor(() =>
      expect(dayButton(grid, 18).closest('td')).not.toHaveAttribute(
        'data-selected',
      ),
    )
    await expect(dayButton(grid, 12).closest('td')).toHaveAttribute(
      'data-selected',
    )
    await expect(popup).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await userEvent.click(dayButton(grid, 15))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'imperative-action' }),
    )
  },
}

export const PresetMovesMonth: Story = {
  render: ({ onSelect }) => (
    <ComposedDatePicker
      {...datePickerControlArgs}
      onSelect={onSelect}
      presets
    />
  ),
  play: async ({ args, canvasElement }) => {
    const popup = await findPopup()
    const target = addDays(sampleToday, 7)
    await expect(within(popup).getByRole('grid')).toHaveAccessibleName(
      monthLabel(sampleToday),
    )
    await expect(monthLabel(target)).not.toBe(monthLabel(sampleToday))
    await userEvent.click(
      within(popup).getByRole('button', { name: 'In a week' }),
    )
    await waitFor(() =>
      expect(within(popup).getByRole('grid')).toHaveAccessibleName(
        monthLabel(target),
      ),
    )
    const grid = within(popup).getByRole('grid')
    await expect(
      dayButton(grid, target.getDate()).closest('td'),
    ).toHaveAttribute('data-selected')
    await expect(
      within(canvasElement).getByRole('button', {
        name: formatLongDate(target, locale),
      }),
    ).toBeVisible()
    await expect(args.onSelect).toHaveBeenCalledOnce()
    await closePopup()
  },
}

export const DropdownNavigation: Story = {
  render: () => (
    <ComposedDatePicker {...datePickerControlArgs} captionLayout="dropdown" />
  ),
  play: async () => {
    const popup = await findPopup()
    await userEvent.selectOptions(
      within(popup).getByRole('combobox', { name: 'Choose the Year' }),
      '2000',
    )
    await userEvent.selectOptions(
      within(popup).getByRole('combobox', { name: 'Choose the Month' }),
      '0',
    )
    await waitFor(() =>
      expect(within(popup).getByRole('grid')).toHaveAccessibleName(
        'January 2000',
      ),
    )
    await closePopup()
  },
}

export const EscapeReturnsFocus: Story = {
  render: () => (
    <ComposedDatePicker {...datePickerControlArgs} defaultOpen={false} />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: placeholder,
    })
    await userEvent.click(trigger)
    await findPopup()
    await closePopup()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const InputSyncsCalendar: Story = {
  render: ({ onSelect }) => <InputDatePicker onSelect={onSelect} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Date')
    fireEvent.change(input, { target: { value: '2026-07-09' } })
    await userEvent.click(canvas.getByRole('button', { name: 'Open calendar' }))
    const grid = within(await findPopup()).getByRole('grid')
    await expect(grid).toHaveAccessibleName('July 2026')
    await expect(dayButton(grid, 9).closest('td')).toHaveAttribute(
      'data-selected',
    )
    await userEvent.click(dayButton(grid, 16))
    await waitFor(() => expect(input).toHaveValue('2026-07-16'))
    await expect(args.onSelect).toHaveBeenCalledWith(new Date(2026, 6, 16))
    await closePopup()
  },
}
