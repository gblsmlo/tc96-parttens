import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { initialCampaigns } from '../../collection/fixtures/campaigns'
import { CampaignSummary } from './fixtures/campaign-summary.tsx'
import { statsControlArgs } from './stats-controls.ts'
import {
  AccentBorderCard,
  BreakdownCard,
  ComparisonCard,
  ComposedMetric,
  DonutCard,
  ProgressCard,
  StatusCard,
  ToggleCard,
} from './stats-layouts.tsx'

const pausedNames = ['Blog · Guia de presentes', 'Atendimento via WhatsApp']

const meta = {
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-7xl p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Stats/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const summaryCard = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name })

const legendOf = (canvasElement: HTMLElement) =>
  within(summaryCard(canvasElement, 'Investido'))
    .getAllByRole('listitem')
    .map((item) => item.textContent?.replace(/\s/g, ' '))

export const RevenueDashboard: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <ComposedMetric
        {...statsControlArgs}
        changeLabel="from last month"
        label="Total revenue"
      />
      <ComposedMetric
        {...statsControlArgs}
        changeLabel=""
        format="decimal"
        label="Active users"
        sparkline
        trend={false}
        value={2350}
      />
      <ProgressCard />
      <ComparisonCard />
      <ComposedMetric
        {...statsControlArgs}
        format="wholeCurrency"
        icon
        label="Net revenue"
        value={45231}
      />
      <BreakdownCard />
      <DonutCard />
      <StatusCard />
      <ToggleCard />
      <AccentBorderCard />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('region')).toHaveLength(10)
  },
}

export const CampaignsSummary: Story = {
  render: () => <CampaignSummary campaigns={initialCampaigns} />,
  play: async ({ canvasElement }) => {
    await expect(summaryCard(canvasElement, 'Investido')).toHaveTextContent(
      'R$ 19.831,80',
    )
    await expect(legendOf(canvasElement)).toEqual([
      'Vendas38,7%',
      'Reconhecimento25,2%',
      'Promoção do app15,7%',
      'Outros20,4%',
    ])
    await expect(summaryCard(canvasElement, 'Alcance')).toHaveTextContent(
      '823.530',
    )
    await expect(summaryCard(canvasElement, 'Em veiculação')).toHaveTextContent(
      '5de 10 campanhas · 50%',
    )
    await expect(
      within(summaryCard(canvasElement, 'Em aprendizado')).getByRole('meter', {
        name: 'Resultados na fase de aprendizado',
      }),
    ).toHaveAttribute('aria-valuenow', '69')
  },
}

export const CampaignsSingleObjective: Story = {
  render: () => (
    <CampaignSummary
      campaigns={initialCampaigns.filter(
        (campaign) => campaign.objective === 'sales',
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(legendOf(canvasElement)).toEqual(['Vendas100%'])
  },
}

export const CampaignsAfterPause: Story = {
  render: () => (
    <CampaignSummary
      campaigns={initialCampaigns.map((campaign) =>
        pausedNames.includes(campaign.name)
          ? { ...campaign, status: 'paused' as const }
          : campaign,
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(summaryCard(canvasElement, 'Em veiculação')).toHaveTextContent(
      '3de 10 campanhas · 30%',
    )
  },
}

export const CampaignsEmpty: Story = {
  render: () => <CampaignSummary campaigns={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(summaryCard(canvasElement, 'Investido')).queryByRole('list'),
    ).toBeNull()
    await expect(summaryCard(canvasElement, 'Alcance')).toHaveTextContent(
      'Sem impressões',
    )
    await expect(
      summaryCard(canvasElement, 'Em aprendizado'),
    ).toHaveTextContent('Nenhuma campanha em aprendizado')
  },
}
