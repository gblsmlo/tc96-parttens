import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProductivityCanvas } from './productivity-canvas.tsx'
import { productivityControlArgs } from './productivity-controls.ts'
import {
  ClocksWithoutSeconds,
  ComposedProductivity,
  MeetingWithoutLink,
  SubtasksOnlyProject,
} from './productivity-layouts.tsx'

const meta = {
  decorators: [ProductivityCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Productivity/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TaskProgressWithoutPeriods: Story = {
  render: () => (
    <ComposedProductivity
      {...productivityControlArgs}
      periods={false}
      widget="task-progress"
    />
  ),
}

export const ProjectCardWithoutDetails: Story = {
  render: () => <SubtasksOnlyProject />,
}

export const UpcomingEventWithoutLink: Story = {
  render: () => <MeetingWithoutLink />,
}

export const WorldClockWithoutSeconds: Story = {
  render: () => <ClocksWithoutSeconds />,
}
