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
  parameters: {
    controls: {
      exclude: ['captionLayout', 'defaultOpen', 'mode', 'selected'],
    },
    layout: 'centered',
  },
  render: (args) => <ComposedDatePicker {...args} />,
  tags: ['!autodocs'],
  title: 'UI/DatePicker/Stories',
} satisfies Meta<DatePickerControls>

export default meta

type Story = StoryObj<DatePickerControls>

export const Default: Story = {}

export const Range: Story = {
  args: { mode: 'range' },
}

export const Selected: Story = {
  args: { selected: true },
}

export const CaptionDropdown: Story = {
  args: { captionLayout: 'dropdown' },
  name: 'Caption dropdown',
}

export const CaptionDropdownMonths: Story = {
  args: { captionLayout: 'dropdown-months' },
  name: 'Caption dropdown-months',
}

export const CaptionDropdownYears: Story = {
  args: { captionLayout: 'dropdown-years' },
  name: 'Caption dropdown-years',
}

export const DefaultOpenFalse: Story = {
  args: { defaultOpen: false },
  name: 'defaultOpen false',
}
