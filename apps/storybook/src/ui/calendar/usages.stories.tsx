import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { calendarA11y, PickerCanvas } from './calendar-frame.tsx'
import { AppointmentPicker, FieldDatePicker } from './calendar-layouts.tsx'

const meta = {
  parameters: { a11y: calendarA11y },
  tags: ['!autodocs'],
  title: 'UI/Calendar/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const BookAppointment: Story = {
  render: () => <AppointmentPicker />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('grid')).toBeVisible()
    await expect(canvas.getByRole('button', { name: '10:00' })).toBeVisible()
  },
}

export const StartDateField: Story = {
  decorators: [PickerCanvas],
  render: () => <FieldDatePicker />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: /Start date/ }),
    ).toHaveTextContent('Pick a date')
  },
}
