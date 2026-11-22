import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarCanvas } from './calendar-canvas.tsx'
import { calendarControlArgs } from './calendar-controls.ts'
import { ComposedCalendar } from './calendar-layouts.tsx'

const meta = {
  decorators: [CalendarCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Calendar/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutTime: Story = {
  render: () => <ComposedCalendar {...calendarControlArgs} time={false} />,
}

export const WithItemAction: Story = {
  render: () => <ComposedCalendar {...calendarControlArgs} action />,
}

export const WithoutOpenTrigger: Story = {
  render: () => (
    <ComposedCalendar {...calendarControlArgs} openTrigger={false} />
  ),
}
