import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScheduleProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { ScheduleCanvas } from './schedule-canvas.tsx'
import { scheduleToday, timedWeeklySchedule } from './schedule-data.ts'
import { OpenOnMount, StatefulSchedule } from './schedule-layouts.tsx'

const ignore = () => undefined

const meta = {
  args: {
    ariaLabel: 'ariaLabel',
    calendarLocale: ptBR,
    onValueChange: ignore,
    today: scheduleToday,
    value: timedWeeklySchedule,
  },
  component: ScheduleProperty,
  decorators: [ScheduleCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Schedule/API Reference',
} satisfies Meta<typeof ScheduleProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'ariaLabel: 26 de out · 14:00 – 16:00 · Semanalmente',
    })

    await expect(
      trigger.querySelector('[data-slot="property-icon"]'),
    ).not.toBeNull()
    await expect(trigger.querySelector('.lucide-repeat')).not.toBeNull()
  },
}

export const PopupAnatomy: Story = {
  parameters: { docs: { story: { iframeHeight: '760px', inline: false } } },
  render: (args) => (
    <OpenOnMount>
      <StatefulSchedule {...args} />
    </OpenOnMount>
  ),
}
