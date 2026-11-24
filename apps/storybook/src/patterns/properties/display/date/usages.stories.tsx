import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { DateCanvas } from './date-canvas.tsx'
import { DateAndTimeBadge, StatefulDate } from './date-layouts.tsx'

const meta = {
  decorators: [DateCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Date/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TargetDate: Story = {
  render: () => (
    <StatefulDate
      ariaLabel="Target date"
      clearLabel="Clear target"
      fallback="No target"
      locale="en-US"
      timeZone="UTC"
      value="2026-06-19T12:00:00.000Z"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Target date: Jun 19',
      }),
    ).toBeVisible()
  },
}

export const OverdueInvoice: Story = {
  render: () => (
    <StatefulDate
      ariaLabel="Vencimento"
      calendarLocale={ptBR}
      displayLabel="14 nov · venceu"
      isOverdue
      locale="pt-BR"
      timeZone="UTC"
      value="2026-11-14T12:00:00.000Z"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Vencimento: 14 nov · venceu',
      }),
    ).toBeVisible()
  },
}

export const PortugueseDeadline: Story = {
  render: () => (
    <StatefulDate
      ariaLabel="Prazo"
      calendarLocale={ptBR}
      fallback="Sem prazo"
      locale="pt-BR"
      timeZone="UTC"
      value="2026-06-19T12:00:00.000Z"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Prazo: 19 de jun.' }),
    ).toBeVisible()
  },
}

export const LastActivity: Story = {
  render: () => (
    <DateProperty
      displayLabel="há 53 minutos"
      locale="pt-BR"
      readOnly
      timeZone="America/Sao_Paulo"
      tooltip
      value="2026-11-13T17:07:00.000Z"
      variant="plain"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('há 53 minutos')).toBeVisible()
  },
}

export const DateAndTime: Story = {
  render: () => <DateAndTimeBadge initialValue="2026-06-19T14:30:00.000Z" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Schedule: Jun 19, 2026, 2:30 PM',
      }),
    ).toBeVisible()
  },
}
