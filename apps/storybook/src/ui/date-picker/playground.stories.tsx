import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DatePickerControls,
  datePickerControlArgs,
  datePickerControlArgTypes,
} from './date-picker-controls.ts'
import { DatePickerCanvas } from './date-picker-frame.tsx'
import { ComposedDatePicker } from './date-picker-layouts.tsx'

const meta = {
  args: datePickerControlArgs,
  argTypes: datePickerControlArgTypes,
  decorators: [DatePickerCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedDatePicker {...args} />,
  tags: ['!autodocs'],
  title: 'UI/DatePicker/Playground',
} satisfies Meta<DatePickerControls>

export default meta

type Story = StoryObj<DatePickerControls>

export const Playground: Story = {}
