import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { CalendarWorkspace } from '../collection/fixtures/calendar-workspace'
import { CalendarCanvas } from './calendar-canvas.tsx'

const meta = {
  decorators: [CalendarCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Calendar/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TeamAgenda: Story = {
  render: () => <CalendarWorkspace />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="calendar-view"]'),
    ).toHaveAttribute('data-calendar-mode', 'week')
    await expect(
      canvas.getByRole('button', { name: 'Abrir Demo para Banco Aurora' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getAllByRole('button', { name: 'Abrir Férias do Diego' }).length,
    ).toBeGreaterThan(1)
  },
}

export const MonthOverview: Story = {
  render: () => <CalendarWorkspace defaultMode="month" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="calendar-view"]'),
    ).toHaveAttribute('data-calendar-mode', 'month')
    await expect(
      canvas.getByRole('button', {
        name: 'Abrir Visita à Logística Rápida',
      }),
    ).toBeInTheDocument()
  },
}
