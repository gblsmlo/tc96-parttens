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
  parameters: {
    docs: {
      description: {
        story:
          'How long a campaign runs, on the [Default](?path=/story/patterns-properties-display-daterange-layouts--default) layout: both ends as day and short month, joined by an en dash.',
      },
    },
  },
  render: () => (
    <StatefulDateRange
      ariaLabel="Vigência da campanha"
      calendarLocale={ptBR}
      locale="pt-BR"
      value={{ from: new Date(2026, 5, 19), to: new Date(2026, 5, 26) }}
      labels={{ clear: 'Limpar vigência', fallback: 'Sem vigência' }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Vigência da campanha: 19 de jun. – 26 de jun.',
      }),
    ).toBeVisible()
  },
}

export const OpenEndedCampaign: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A campaign with no end date yet, on the [Default](?path=/story/patterns-properties-display-daterange-layouts--default) layout: the lone start reads after A partir de.',
      },
    },
  },
  render: () => (
    <StatefulDateRange
      ariaLabel="Vigência da campanha"
      calendarLocale={ptBR}
      locale="pt-BR"
      value={{ from: new Date(2026, 5, 19), to: undefined }}
      labels={{ clear: 'Limpar vigência', fallback: 'Sem vigência' }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Vigência da campanha: A partir de 19 de jun.',
      }),
    ).toBeVisible()
  },
}

export const SupportWindow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The support window of a contract, on the [Default](?path=/story/patterns-properties-display-daterange-layouts--default) layout: two months apart, with the calendar in Portuguese.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'The interval of a report, on the [Default](?path=/story/patterns-properties-display-daterange-layouts--default) layout, read-only with a `plain` surface: the consumer names the quarter in `displayLabel`.',
      },
    },
  },
  render: () => (
    <StatefulDateRange
      ariaLabel="Período do relatório"
      displayLabel="2º trimestre de 2026"
      locale="pt-BR"
      readOnly
      value={{ from: new Date(2026, 3, 1), to: new Date(2026, 5, 30) }}
      variant="plain"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('2º trimestre de 2026'),
    ).toBeVisible()
  },
}
