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
  parameters: {
    controls: {
      exclude: [
        'completed',
        'empty',
        'loading',
        'mode',
        'tone',
        'weekStartsOn',
      ],
    },
  },
  render: (args) => <ComposedCalendar {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Calendar/Variants',
} satisfies Meta<CalendarControls>

export default meta

type Story = StoryObj<CalendarControls>

export const Default: Story = {}

export const Day: Story = {
  args: { mode: 'day' },
}

export const Month: Story = {
  args: { mode: 'month' },
}

export const WeekStartsOnMonday: Story = {
  args: { weekStartsOn: 1 },
  name: 'weekStartsOn 1',
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { empty: true },
}

export const TonePrimary: Story = {
  args: { tone: 'primary' },
  name: 'Tone primary',
}

export const ToneSuccess: Story = {
  args: { tone: 'success' },
  name: 'Tone success',
}

export const ToneWarning: Story = {
  args: { tone: 'warning' },
  name: 'Tone warning',
}

export const ToneDestructive: Story = {
  args: { tone: 'destructive' },
  name: 'Tone destructive',
}

export const Completed: Story = {
  args: { completed: true },
}
