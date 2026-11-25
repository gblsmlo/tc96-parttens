import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarCanvas } from './calendar-canvas.tsx'
import {
  type CalendarControls,
  calendarControlArgs,
  calendarControlArgTypes,
} from './calendar-controls.ts'
import { ComposedCalendar } from './calendar-layouts.tsx'

const meta = {
  args: calendarControlArgs,
  argTypes: calendarControlArgTypes,
  decorators: [CalendarCanvas],
  render: (args) => <ComposedCalendar {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Calendar/Playground',
} satisfies Meta<CalendarControls>

export default meta

type Story = StoryObj<CalendarControls>

export const Playground: Story = {}
