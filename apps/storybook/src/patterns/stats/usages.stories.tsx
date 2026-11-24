import type { Meta, StoryObj } from '@storybook/react-vite'
import { AreaMetricWidget, MetricWidget } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { initialCampaigns } from '../collection/fixtures/campaigns'
import {
  DeliveryCard,
  LearningCard,
  ReachCard,
  SpendCard,
} from './fixtures/campaign-cards.tsx'
import { StatsCanvas } from './stats-canvas.tsx'

const pausedNames = ['Blog · Guia de presentes', 'Atendimento via WhatsApp']

const meta = {
  decorators: [StatsCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Stats/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const card = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name })

const legendOf = (canvasElement: HTMLElement) =>
  within(card(canvasElement, 'Investido'))
    .getAllByRole('listitem')
    .map((item) => item.textContent?.replace(/\s/g, ' '))

export const MonthlyRevenue: Story = {
  render: () => (
    <MetricWidget
      change={0.084}
      changeLabel="from October"
      format={{ maximumFractionDigits: 0 }}
      label="Revenue in November"
      value={48250}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Revenue in November')).toHaveTextContent(
      '$48,250',
    )
  },
}

export const ActiveLicenses: Story = {
  render: () => (
    <AreaMetricWidget
      caption="Seats in use, last 12 weeks"
      format={{ style: 'decimal' }}
      label="Active licenses"
      points={[
        2810, 2874, 2902, 2955, 3010, 3038, 3091, 3120, 3166, 3210, 3248, 3297,
      ]}
      value={3297}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Active licenses')).toHaveTextContent(
      '3,297',
    )
  },
}

export const CampaignSpend: Story = {
  render: () => <SpendCard campaigns={initialCampaigns} />,
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Investido')).toHaveTextContent(
      'R$ 19.831,80',
    )
    await expect(legendOf(canvasElement)).toEqual([
      'Vendas38,7%',
      'Reconhecimento25,2%',
      'Promoção do app15,7%',
      'Outros20,4%',
    ])
  },
}

export const CampaignSpendSingleObjective: Story = {
  render: () => (
    <SpendCard
      campaigns={initialCampaigns.filter(
        (campaign) => campaign.objective === 'sales',
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(legendOf(canvasElement)).toEqual(['Vendas100%'])
  },
}

export const CampaignSpendEmpty: Story = {
  render: () => <SpendCard campaigns={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(card(canvasElement, 'Investido')).queryByRole('list'),
    ).toBeNull()
  },
}

export const CampaignReach: Story = {
  render: () => <ReachCard campaigns={initialCampaigns} />,
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Alcance')).toHaveTextContent('823.530')
  },
}

export const CampaignReachEmpty: Story = {
  render: () => <ReachCard campaigns={[]} />,
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Alcance')).toHaveTextContent(
      'Sem impressões',
    )
  },
}

export const CampaignsDelivering: Story = {
  render: () => <DeliveryCard campaigns={initialCampaigns} />,
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Em veiculação')).toHaveTextContent(
      '5de 10 campanhas · 50%',
    )
  },
}

export const CampaignsDeliveringAfterPause: Story = {
  render: () => (
    <DeliveryCard
      campaigns={initialCampaigns.map((campaign) =>
        pausedNames.includes(campaign.name)
          ? { ...campaign, status: 'paused' as const }
          : campaign,
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Em veiculação')).toHaveTextContent(
      '3de 10 campanhas · 30%',
    )
  },
}

export const CampaignsLearning: Story = {
  render: () => <LearningCard campaigns={initialCampaigns} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(card(canvasElement, 'Em aprendizado')).getByRole('meter', {
        name: 'Resultados na fase de aprendizado',
      }),
    ).toHaveAttribute('aria-valuenow', '69')
  },
}

export const CampaignsLearningEmpty: Story = {
  render: () => <LearningCard campaigns={[]} />,
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Em aprendizado')).toHaveTextContent(
      'Nenhuma campanha em aprendizado',
    )
  },
}
