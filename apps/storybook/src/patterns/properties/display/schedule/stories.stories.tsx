import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScheduleCanvas } from './schedule-canvas.tsx'
import {
  type ScheduleControls,
  scheduleControlArgs,
  scheduleControlArgTypes,
} from './schedule-controls.ts'
import { ComposedSchedule } from './schedule-layouts.tsx'

const meta = {
  args: scheduleControlArgs,
  argTypes: scheduleControlArgTypes,
  decorators: [ScheduleCanvas],
  parameters: {
    controls: { exclude: ['openOnMount', 'value', 'variant'] },
  },
  render: (args) => <ComposedSchedule {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Schedule/Stories',
} satisfies Meta<ScheduleControls>

export default meta

type Story = StoryObj<ScheduleControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const AllDay: Story = {
  args: { value: 'allDay' },
  name: 'All day',
}

export const Empty: Story = {
  args: { value: 'empty' },
}

export const Open: Story = {
  args: { openOnMount: true },
}
