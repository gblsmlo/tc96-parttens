import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { DateRangeCanvas } from './date-range-canvas.tsx'
import { StatefulDateRange } from './date-range-layouts.tsx'

const meta = {
  decorators: [DateRangeCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/DateRange/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CampaignValidity: Story = {
  render: () => (
    <StatefulDateRange
      ariaLabel="Campaign validity"
      clearLabel="Clear validity"
      fallback="No validity"
      fromLabel="From"
      locale="en-US"
      untilLabel="Until"
      value={{ from: new Date(2026, 5, 19), to: new Date(2026, 5, 26) }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Campaign validity: Jun 19 – Jun 26',
      }),
    ).toBeVisible()
  },
}

export const OpenEndedCampaign: Story = {
  render: () => (
    <StatefulDateRange
      ariaLabel="Campaign validity"
      clearLabel="Clear validity"
      fallback="No validity"
      fromLabel="From"
      locale="en-US"
      untilLabel="Until"
      value={{ from: new Date(2026, 5, 19), to: undefined }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Campaign validity: From Jun 19',
      }),
    ).toBeVisible()
  },
}

export const SupportWindow: Story = {
  render: () => (
    <StatefulDateRange
      ariaLabel="Janela de suporte"
      calendarLocale={ptBR}
      locale="pt-BR"
      value={{ from: new Date(2026, 5, 1), to: new Date(2026, 6, 31) }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: /^Janela de suporte: /,
      }),
    ).toBeVisible()
  },
}

export const ReportingInterval: Story = {
  render: () => (
    <StatefulDateRange
      displayLabel="Q2 2026"
      locale="en-US"
      readOnly
      value={{ from: new Date(2026, 3, 1), to: new Date(2026, 5, 30) }}
      variant="plain"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Q2 2026')).toBeVisible()
  },
}
