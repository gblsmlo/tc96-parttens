import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ActivityFeedWidget,
  ContactWidget,
  DealsWidget,
  PipelineWidget,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { expect, fn, userEvent, within } from 'storybook/test'

interface BehaviorArgs {
  onPeriodChange: (period: string) => void
}

const stages = [
  { count: 12, id: 'lead', label: 'Lead', value: 40000 },
  { count: 6, id: 'proposal', label: 'Proposal', value: 50000 },
  { count: 2, id: 'won', label: 'Won', value: 10000 },
]

const periods = [
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
] as const

const twoDeals = [
  {
    closeLabel: 'Closes Jun 30',
    company: 'Acme Corp',
    id: 'acme',
    name: 'Website redesign',
    owner: { id: 'ana', label: 'Ana Martins' },
    stage: { label: 'Negotiation', tone: 'warning' as const },
    value: 48000,
  },
  {
    id: 'globex',
    name: 'Annual license',
    stage: { label: 'Won', tone: 'success' as const },
    value: 12500.5,
  },
]

const twoActivities = [
  {
    description: 'Discussed renewal terms.',
    icon: <svg aria-hidden="true" />,
    id: 'call',
    person: { id: 'ana', label: 'Ana Martins' },
    timeLabel: '2h ago',
    title: 'called Acme Corp',
    tone: 'success' as const,
  },
  {
    id: 'mail',
    person: { id: 'gabriel', label: 'Gabriel Melo' },
    timeLabel: 'Yesterday',
    title: 'sent a proposal',
  },
]

const meta = {
  args: { onPeriodChange: fn() },
  argTypes: { onPeriodChange: { control: false } },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/CRM/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const pipeline = () => <PipelineWidget stages={stages} title="Sales pipeline" />

const barsOf = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLElement>(
    '[data-slot="pipeline-stage"] [aria-hidden] > div',
  ),
]

export const PipelineSumsTheStages: Story = {
  render: pipeline,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Sales pipeline',
    })
    await expect(region).toHaveTextContent('$100,000.00')
    await expect(region).toHaveTextContent('Total no funil')
  },
}

export const PipelineAnnouncesEachShare: Story = {
  render: pipeline,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Sales pipeline' }),
    ).toHaveTextContent('50.00%')
  },
}

export const PipelineScalesBarsToTheLargestStage: Story = {
  render: pipeline,
  play: async ({ canvasElement }) => {
    await expect(barsOf(canvasElement).map((bar) => bar.style.width)).toEqual([
      '80%',
      '100%',
      '20%',
    ])
  },
}

export const PipelineColorsBarsByPosition: Story = {
  render: pipeline,
  play: async ({ canvasElement }) => {
    await expect(
      barsOf(canvasElement).map((bar) => bar.style.backgroundColor),
    ).toEqual(['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'])
  },
}

export const PipelineListsStagesInOrder: Story = {
  render: pipeline,
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Sales pipeline',
    })
    await expect(list.tagName).toBe('OL')
    await expect(
      list.querySelectorAll('[data-slot="pipeline-stage"]'),
    ).toHaveLength(3)
  },
}

export const PipelineReportsPeriodChanges: Story = {
  render: ({ onPeriodChange }) => (
    <PipelineWidget
      onPeriodChange={onPeriodChange}
      period="quarter"
      periods={periods}
      stages={stages}
      title="Sales pipeline"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Month' }),
    )
    await expect(args.onPeriodChange).toHaveBeenCalledTimes(1)
    await expect(args.onPeriodChange).toHaveBeenCalledWith('month')
  },
}

export const PipelinePeriodsReplaceTheAction: Story = {
  render: () => (
    <PipelineWidget
      action={<Button size="sm">Export</Button>}
      period="month"
      periods={periods}
      stages={stages}
      title="Sales pipeline"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Month' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Export' })).toBeNull()
  },
}

export const DealsShowValueCompanyAndCloseDate: Story = {
  render: () => <DealsWidget deals={twoDeals} title="Top deals" />,
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Top deals' })
    await expect(list).toHaveAttribute('data-slot', 'deal-list')
    await expect(
      list.querySelectorAll('[data-slot="deal-list-item"]'),
    ).toHaveLength(2)
    await expect(list).toHaveTextContent('$48,000.00')
    await expect(list).toHaveTextContent('$12,500.50')
    await expect(list).toHaveTextContent('Acme Corp')
    await expect(list).toHaveTextContent('Closes Jun 30')
  },
}

export const DealsMapTheStageToneToABadge: Story = {
  render: () => <DealsWidget deals={twoDeals} title="Top deals" />,
  play: async ({ canvasElement }) => {
    const stageBadges = [
      ...canvasElement.querySelectorAll('[data-slot="deal-stage"]'),
    ]
    await expect(stageBadges.map((stage) => stage.textContent)).toEqual([
      'Negotiation',
      'Won',
    ])
    await expect(
      stageBadges.map((stage) => stage.getAttribute('data-tone')),
    ).toEqual(['warning', 'success'])
    await expect(stageBadges[0]).toHaveClass('text-warning-foreground')
  },
}

export const DealsNameTheOwner: Story = {
  render: () => <DealsWidget deals={twoDeals} title="Top deals" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Responsável' }),
    ).toHaveTextContent('AMAna Martins')
  },
}

export const DealsEmptyLabelWithoutList: Story = {
  render: () => (
    <DealsWidget deals={[]} emptyLabel="Nothing open" title="Deals" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('list')).toBeNull()
    await expect(canvas.getByText('Nothing open')).toHaveAttribute(
      'data-slot',
      'deals-empty',
    )
  },
}

export const ActivityFeedNamesThePersonAndTime: Story = {
  render: () => (
    <ActivityFeedWidget activities={twoActivities} title="Recent activity" />
  ),
  play: async ({ canvasElement }) => {
    const items = [
      ...canvasElement.querySelectorAll('[data-slot="activity-feed-item"]'),
    ]
    await expect(items).toHaveLength(2)
    await expect(items[0]).toHaveTextContent('Ana Martins called Acme Corp')
    await expect(items[0]).toHaveTextContent('Discussed renewal terms.')
    await expect(items[0]).toHaveTextContent('2h ago')
  },
}

export const ActivityFeedTonesTheIconOnlyWhenGiven: Story = {
  render: () => (
    <ActivityFeedWidget activities={twoActivities} title="Recent activity" />
  ),
  play: async ({ canvasElement }) => {
    const items = [
      ...canvasElement.querySelectorAll('[data-slot="activity-feed-item"]'),
    ]
    await expect(
      items[0]?.querySelector('[data-slot="activity-feed-icon"]'),
    ).toHaveClass('text-success-foreground')
    await expect(
      items[1]?.querySelector('[data-slot="activity-feed-icon"]'),
    ).toBeNull()
  },
}

export const ActivityFeedIsAnOrderedList: Story = {
  render: () => (
    <ActivityFeedWidget activities={twoActivities} title="Recent activity" />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Recent activity' })
        .tagName,
    ).toBe('OL')
  },
}

export const ContactShowsRoleCompanyAndTags: Story = {
  render: () => (
    <ContactWidget
      company="Acme Corp"
      jobTitle="Head of Ops"
      person={{ id: 'ana', label: 'Ana Martins' }}
      tags={[{ id: 'vip', label: 'VIP' }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Ana Martins',
    })
    await expect(region).toHaveTextContent('Head of Ops · Acme Corp')
    await expect(region).toHaveTextContent('VIP')
  },
}

export const ContactLinksOnlyTheChannelsItReceives: Story = {
  render: () => (
    <ContactWidget
      email="ana@acme.com"
      person={{ id: 'ana', label: 'Ana Martins' }}
      whatsapp="+55 (11) 98765-4321"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'E-mail' })).toHaveAttribute(
      'href',
      'mailto:ana@acme.com',
    )
    await expect(
      canvas.getByRole('link', { name: 'WhatsApp' }),
    ).toHaveAttribute('href', 'https://wa.me/5511987654321')
    await expect(canvas.queryByRole('link', { name: 'Ligar' })).toBeNull()
  },
}

export const ContactBuildsAPhoneLink: Story = {
  render: () => (
    <ContactWidget
      person={{ id: 'joao', label: 'João Lima' }}
      phone="+5511912345678"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Ligar' }),
    ).toHaveAttribute('href', 'tel:+5511912345678')
  },
}

export const ContactOpensWhatsAppInANewTab: Story = {
  render: () => (
    <ContactWidget
      email="ana@acme.com"
      person={{ id: 'ana', label: 'Ana Martins' }}
      whatsapp="+55 (11) 98765-4321"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const whatsapp = canvas.getByRole('link', { name: 'WhatsApp' })
    await expect(whatsapp).toHaveAttribute('target', '_blank')
    await expect(whatsapp).toHaveAttribute('rel', 'noreferrer')
    await expect(
      canvas.getByRole('link', { name: 'E-mail' }),
    ).not.toHaveAttribute('target')
  },
}

export const ContactReusesTheTimeline: Story = {
  render: () => (
    <ContactWidget
      activities={[
        {
          id: 'call',
          person: { id: 'ana', label: 'Ana Martins' },
          timeLabel: '2h ago',
          title: 'called about the renewal',
        },
      ]}
      person={{ id: 'ana', label: 'Ana Martins' }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Atividade recente' }),
    ).toHaveTextContent('Ana Martins called about the renewal')
    await expect(
      canvasElement.querySelectorAll('[data-slot="activity-feed-item"]'),
    ).toHaveLength(1)
  },
}

export const ContactEmptyActivity: Story = {
  render: () => (
    <ContactWidget
      activities={[]}
      emptyLabel="Nenhum contato ainda"
      person={{ id: 'joao', label: 'João Lima' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum contato ainda')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const ContactHidesActivityWithoutAList: Story = {
  render: () => <ContactWidget person={{ id: 'joao', label: 'João Lima' }} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Atividade recente')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="activity-feed-empty"]'),
    ).toBeNull()
  },
}
