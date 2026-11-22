import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScheduleCanvas } from './schedule-canvas.tsx'
import { scheduleControlArgs } from './schedule-controls.ts'
import { ComposedSchedule } from './schedule-layouts.tsx'

const meta = {
  decorators: [ScheduleCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Schedule/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DateOnly: Story = {
  render: () => (
    <ComposedSchedule
      {...scheduleControlArgs}
      ariaLabel="Prazo"
      dateOnly
      openOnMount
      value="allDay"
    />
  ),
}

export const DrillIn: Story = {
  render: () => (
    <ComposedSchedule
      {...scheduleControlArgs}
      footerLayout="drill-in"
      openOnMount
    />
  ),
}
