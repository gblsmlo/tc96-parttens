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
    controls: { exclude: ['readOnly', 'value', 'variant'] },
  },
  render: (args) => <ComposedSchedule {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Schedule/Variants',
} satisfies Meta<ScheduleControls>

export default meta

type Story = StoryObj<ScheduleControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const AllDay: Story = {
  args: { value: 'allDay' },
}

export const Empty: Story = {
  args: { value: 'empty' },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}
