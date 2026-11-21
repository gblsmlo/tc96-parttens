import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CalendarControls,
  calendarControlArgs,
  calendarControlArgTypes,
} from './calendar-controls.ts'
import { ComposedCalendar } from './calendar-layouts.tsx'

const meta = {
  args: calendarControlArgs,
  argTypes: calendarControlArgTypes,
  parameters: {
    controls: { exclude: ['captionLayout', 'mode', 'showOutsideDays'] },
  },
  render: (args) => <ComposedCalendar {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Calendar/Stories',
} satisfies Meta<CalendarControls>

export default meta

type Story = StoryObj<CalendarControls>

export const Default: Story = {}

export const Multiple: Story = {
  args: { mode: 'multiple' },
}

export const Range: Story = {
  args: { mode: 'range' },
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

export const WithoutOutsideDays: Story = {
  args: { showOutsideDays: false },
  name: 'showOutsideDays false',
}
