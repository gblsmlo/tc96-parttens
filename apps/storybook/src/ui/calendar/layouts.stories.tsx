import type { Meta, StoryObj } from '@storybook/react-vite'
import { PickerCanvas } from './calendar-frame.tsx'
import { PopoverRangeCalendar, PresetsCalendar } from './calendar-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Calendar/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithPresets: Story = {
  render: () => <PresetsCalendar />,
}

export const InPopover: Story = {
  decorators: [PickerCanvas],
  render: () => <PopoverRangeCalendar />,
}
