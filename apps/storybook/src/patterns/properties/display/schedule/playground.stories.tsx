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
  render: (args) => <ComposedSchedule {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Schedule/Playground',
} satisfies Meta<ScheduleControls>

export default meta

type Story = StoryObj<ScheduleControls>

export const Playground: Story = {}
