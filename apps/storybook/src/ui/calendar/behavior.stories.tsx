import type { Meta, StoryObj } from '@storybook/react-vite'
import { addDays } from '@tc96/ui/helpers/date'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { calendarControlArgs } from './calendar-controls.ts'
import { PickerCanvas } from './calendar-frame.tsx'
import {
  AppointmentPicker,
  ComposedCalendar,
  FieldDatePicker,
  PopoverRangeCalendar,
  PresetsCalendar,
} from './calendar-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Calendar/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DayButtonClassNames: Story = {
  render: () => <ComposedCalendar {...calendarControlArgs} />,
  play: async ({ canvasElement }) => {
    const dayButton = canvasElement.querySelector<HTMLElement>(
      '[data-selected] button',
    )
    if (!dayButton) throw new Error('The selected day did not render.')
    const { borderRadius, width } = getComputedStyle(dayButton)
    await expect(Number.parseFloat(borderRadius)).toBeGreaterThanOrEqual(
      Number.parseFloat(width) / 2,
    )
  },
}

export const SelectsDay: Story = {
  render: () => <ComposedCalendar {...calendarControlArgs} />,
  play: async ({ canvasElement }) => {
    const next = canvasElement.querySelector<HTMLElement>(
      'td:not([data-selected]):not([data-outside]):not([data-disabled]) button',
    )
    if (!next) throw new Error('No other day to pick.')
    await userEvent.click(next)
    await waitFor(() =>
      expect(next.closest('td')).toHaveAttribute('data-selected'),
    )
  },
}

export const PresetSelectsDate: Story = {
  render: () => <PresetsCalendar />,
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
}

export const PicksRangeInPopover: Story = {
  decorators: [PickerCanvas],
  render: () => <PopoverRangeCalendar />,
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
}

export const PicksDateInField: Story = {
  decorators: [PickerCanvas],
  render: () => <FieldDatePicker />,
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
}

export const PicksAvailableSlot: Story = {
  render: () => <AppointmentPicker />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slot = canvas.getByRole('button', { name: '10:00' })
    await userEvent.click(slot)
    await expect(slot).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: '09:00' })).toBeDisabled()
  },
}
