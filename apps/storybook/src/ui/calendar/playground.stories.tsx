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
  render: (args) => <ComposedCalendar {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Calendar/Playground',
} satisfies Meta<CalendarControls>

export default meta

type Story = StoryObj<CalendarControls>

export const Playground: Story = {}
