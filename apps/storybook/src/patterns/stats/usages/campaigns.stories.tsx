import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { initialCampaigns } from '../../collection-views/fixtures/campaigns'
import { CampaignSummary } from '../fixtures/campaign-summary'

const pausedNames = ['Blog · Guia de presentes', 'Atendimento via WhatsApp']

const meta = {
  args: { campaigns: initialCampaigns },
  component: CampaignSummary,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-7xl p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'The summary row of a Meta Ads campaigns screen, with one Stats card per data type: **Investido** breaks the spend down by objective, **Alcance** adds the impressions per person, **Em veiculação** draws the share of delivering campaigns on a ring, and **Em aprendizado** measures the results of the learning campaigns against 50 each. Every card shares one anatomy, so the label, the value and the detail line up when the four sit in one row.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/Stats/Usages/Campaigns',
} satisfies Meta<typeof CampaignSummary>

export default meta

type Story = StoryObj<typeof meta>

const summaryCard = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name })

const legendOf = (canvasElement: HTMLElement) =>
  within(summaryCard(canvasElement, 'Investido'))
    .getAllByRole('listitem')
    .map((item) => item.textContent?.replace(/\s/g, ' '))

export const Default: Story = {
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

export const SingleObjective: Story = {
  args: {
    campaigns: initialCampaigns.filter(
      (campaign) => campaign.objective === 'sales',
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filtered to Vendas: the spend bar holds one segment and the learning meter tracks the one sales campaign still learning.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(legendOf(canvasElement)).toEqual(['Vendas100%'])
    await expect(summaryCard(canvasElement, 'Em veiculação')).toHaveTextContent(
      '2de 3 campanhas · 67%',
    )
    await expect(
      within(summaryCard(canvasElement, 'Em aprendizado')).getByRole('meter', {
        name: 'Resultados na fase de aprendizado',
      }),
    ).toHaveAttribute('aria-valuenow', '31')
  },
}

export const AfterPause: Story = {
  args: {
    campaigns: initialCampaigns.map((campaign) =>
      pausedNames.includes(campaign.name)
        ? { ...campaign, status: 'paused' as const }
        : campaign,
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Two delivering campaigns paused: Em veiculação drops from 5 to 3 and its ring follows.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(summaryCard(canvasElement, 'Em veiculação')).toHaveTextContent(
      '3de 10 campanhas · 30%',
    )
  },
}

export const Empty: Story = {
  args: { campaigns: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(summaryCard(canvasElement, 'Investido')).queryByRole('list'),
    ).toBeNull()
    await expect(summaryCard(canvasElement, 'Alcance')).toHaveTextContent(
      'Sem impressões',
    )
    await expect(summaryCard(canvasElement, 'Em veiculação')).toHaveTextContent(
      '0de 0 campanhas',
    )
    await expect(
      summaryCard(canvasElement, 'Em aprendizado'),
    ).toHaveTextContent('Nenhuma campanha em aprendizado')
  },
}
