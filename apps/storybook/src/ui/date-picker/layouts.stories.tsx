import type { Meta, StoryObj } from '@storybook/react-vite'
import { datePickerControlArgs } from './date-picker-controls.ts'
import { DatePickerCanvas } from './date-picker-frame.tsx'
import { ComposedDatePicker, InputDatePicker } from './date-picker-layouts.tsx'

const meta = {
  decorators: [DatePickerCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/DatePicker/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutIcon: Story = {
  render: () => <ComposedDatePicker {...datePickerControlArgs} icon={false} />,
}

export const WithPresets: Story = {
  render: () => <ComposedDatePicker {...datePickerControlArgs} presets />,
}

export const WithInput: Story = {
  render: () => <InputDatePicker defaultOpen />,
}
