import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import {
  type Activity,
  ActivityFeedWidget,
  ContactWidget,
  type Deal,
  DealsWidget,
  IconFrame,
  type MarketShareSegment,
  MarketShareWidget,
  MetricWidget,
  type PipelineStage,
  PipelineWidget,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  BuildingIcon,
  CalendarIcon,
  EllipsisIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
  TargetIcon,
  UsersIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

type PipelinePeriod = 'month' | 'quarter'

const pipelinePeriods = [
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
] as const

const pipelineStages: Record<PipelinePeriod, PipelineStage[]> = {
  month: [
    { count: 18, id: 'lead', label: 'Lead', value: 96000 },
    { count: 11, id: 'qualified', label: 'Qualified', value: 74500 },
    { count: 6, id: 'proposal', label: 'Proposal', value: 52000 },
    { count: 3, id: 'negotiation', label: 'Negotiation', value: 31000 },
    { count: 2, id: 'won', label: 'Won', value: 18400 },
  ],
  quarter: [
    { count: 54, id: 'lead', label: 'Lead', value: 288000 },
    { count: 32, id: 'qualified', label: 'Qualified', value: 214000 },
    { count: 17, id: 'proposal', label: 'Proposal', value: 149000 },
    { count: 9, id: 'negotiation', label: 'Negotiation', value: 92000 },
    { count: 7, id: 'won', label: 'Won', value: 61200 },
  ],
}

const people = {
  ana: { id: 'ana', label: 'Ana Martins' },
  gabriel: { id: 'gabriel', label: 'Gabriel Melo' },
  marina: { id: 'marina', label: 'Marina Souza' },
}

const deals: Deal[] = [
  {
    closeLabel: 'Closes Jun 30',
    company: 'Acme Corp',
    icon: (
      <IconFrame>
        <BuildingIcon />
      </IconFrame>
    ),
    id: 'acme',
    name: 'Website redesign',
    owner: people.ana,
    stage: { label: 'Negotiation', tone: 'warning' },
    value: 48000,
  },
  {
    closeLabel: 'Closes Jul 12',
    company: 'Globex',
    icon: (
      <IconFrame>
        <BuildingIcon />
      </IconFrame>
    ),
    id: 'globex',
    name: 'Annual license',
    owner: people.gabriel,
    stage: { label: 'Proposal', tone: 'info' },
    value: 32500,
  },
  {
    closeLabel: 'Closed Jun 2',
    company: 'Initech',
    icon: (
      <IconFrame>
        <BuildingIcon />
      </IconFrame>
    ),
    id: 'initech',
    name: 'Onboarding package',
    owner: people.marina,
    stage: { label: 'Won', tone: 'success' },
    value: 12500.5,
  },
]

const activities: Activity[] = [
  {
    description: 'Discussed renewal terms and the Q3 rollout.',
    icon: <PhoneIcon />,
    id: 'call',
    person: people.ana,
    timeLabel: '2h ago',
    title: 'called Acme Corp',
    tone: 'success',
  },
  {
    icon: <MailIcon />,
    id: 'mail',
    person: people.gabriel,
    timeLabel: '5h ago',
    title: 'sent a proposal to Globex',
    tone: 'info',
  },
  {
    description: 'Demo scheduled for Thursday, 10:00.',
    icon: <CalendarIcon />,
    id: 'meeting',
    person: people.marina,
    timeLabel: 'Yesterday',
    title: 'booked a demo with Initech',
  },
  {
    icon: <FileTextIcon />,
    id: 'note',
    person: people.ana,
    timeLabel: '2 days ago',
    title: 'flagged Umbrella as at risk',
    tone: 'warning',
  },
]

const leadSources: MarketShareSegment[] = [
  { change: 0.082, id: 'organic', label: 'Organic', value: 42 },
  { change: 0.031, id: 'referral', label: 'Referral', value: 28 },
  { change: -0.012, id: 'paid', label: 'Paid', value: 18 },
  {
    change: 0.004,
    color: 'var(--muted-foreground)',
    id: 'other',
    label: 'Other',
    value: 12,
  },
]

function SalesPipeline() {
  const [period, setPeriod] = useState<PipelinePeriod>('month')

  return (
    <PipelineWidget
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Pipeline period"
      periods={pipelinePeriods}
      stages={pipelineStages[period]}
      title="Sales pipeline"
      totalLabel="Open pipeline value"
    />
  )
}

function TopDeals() {
  return (
    <DealsWidget
      action={
        <Button size="sm" variant="ghost">
          View all
        </Button>
      }
      deals={deals}
      ownerLabel="Owner"
      title="Top deals"
    />
  )
}

function RecentActivity() {
  return <ActivityFeedWidget activities={activities} title="Recent activity" />
}

const contactActivities: Activity[] = [
  {
    description: 'Asked for the enterprise tier comparison.',
    icon: <PhoneIcon />,
    id: 'call',
    person: people.gabriel,
    timeLabel: '2h ago',
    title: 'called Ana',
    tone: 'success',
  },
  {
    icon: <MailIcon />,
    id: 'mail',
    person: people.marina,
    timeLabel: 'Yesterday',
    title: 'sent the renewal proposal',
    tone: 'info',
  },
  {
    description: 'Quarterly review booked for Jun 18, 14:00.',
    icon: <CalendarIcon />,
    id: 'meeting',
    person: people.gabriel,
    timeLabel: '3 days ago',
    title: 'scheduled a review',
  },
]

function Contact({
  activities = contactActivities,
}: Readonly<{ activities?: Activity[] }>) {
  return (
    <ContactWidget
      action={
        <Button aria-label="More actions" size="icon-sm" variant="ghost">
          <EllipsisIcon aria-hidden="true" />
        </Button>
      }
      activities={activities}
      activitiesLabel="Recent activity"
      channelLabels={{ email: 'Email', phone: 'Call', whatsapp: 'WhatsApp' }}
      company="Acme Corp"
      email="ana.martins@acme.com"
      emptyLabel="No activity yet"
      person={people.ana}
      phone="+1 415 555 0132"
      jobTitle="Head of Operations"
      tags={[
        { id: 'customer', label: 'Customer' },
        { id: 'decision-maker', label: 'Decision maker' },
      ]}
      whatsapp="+1 415 555 0132"
    />
  )
}

function LeadSources() {
  return (
    <MarketShareWidget
      endLabel="30 Jun"
      segments={leadSources}
      startLabel="1 Jun"
      title="Lead sources"
    />
  )
}

function Kpis() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricWidget
        change={0.12}
        changeLabel="vs. last month"
        icon={
          <IconFrame>
            <UsersIcon />
          </IconFrame>
        }
        label="New leads"
        value={128}
        format={{ style: 'decimal' }}
      />
      <MetricWidget
        change={0.031}
        changeLabel="vs. last month"
        format={{ maximumFractionDigits: 0, style: 'percent' }}
        icon={
          <IconFrame>
            <TargetIcon />
          </IconFrame>
        }
        label="Conversion rate"
        tone="inverted"
        value={0.24}
      />
      <MetricWidget
        change={0.084}
        changeLabel="vs. last month"
        label="Revenue"
        value={184200.5}
      />
    </div>
  )
}

const warningBadgeContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector: '*:not([data-slot="deal-stage"][data-tone="warning"])',
        },
      ],
    },
  },
}

const invertedThemeContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector:
            '*:not([data-tone="inverted"] *):not([data-slot="deal-stage"][data-tone="warning"])',
        },
      ],
    },
  },
}

const meta = {
  title: 'Patterns/Widgets/CRM',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  parameters: invertedThemeContrast,
  render: () => (
    <div className="grid min-h-screen place-items-center p-6 sm:p-10">
      <div className="grid w-full max-w-5xl gap-4">
        <Kpis />
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-4">
            <SalesPipeline />
            <LeadSources />
          </div>
          <div className="grid content-start gap-4">
            <TopDeals />
            <Contact />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pipeline = canvas.getByRole('region', { name: 'Sales pipeline' })
    await expect(pipeline).toHaveTextContent('$271,900.00')
    await userEvent.click(
      within(pipeline).getByRole('button', { name: 'Quarter' }),
    )
    await expect(pipeline).toHaveTextContent('$804,200.00')
    await expect(
      canvas.getByRole('region', { name: 'Conversion rate' }),
    ).toHaveTextContent('24%')
    await expect(canvas.getByRole('list', { name: 'Top deals' })).toBeVisible()
  },
}

const single =
  (width: string): Decorator =>
  (Story) => (
    <div className="grid min-h-screen place-items-center p-6">
      <div className={`w-full ${width}`}>
        <Story />
      </div>
    </div>
  )

export const Pipeline: Story = {
  decorators: [single('max-w-md')],
  render: () => <SalesPipeline />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const widget = canvas.getByRole('region', { name: 'Sales pipeline' })
    await expect(widget).toHaveTextContent('Open pipeline value')
    await userEvent.click(
      within(widget).getByRole('button', { name: 'Quarter' }),
    )
    await expect(widget).toHaveTextContent('$804,200.00')
    await expect(within(widget).getByRole('list')).toHaveTextContent('Won')
  },
}

export const Deals: Story = {
  decorators: [single('max-w-md')],
  parameters: warningBadgeContrast,
  render: () => <TopDeals />,
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Top deals' })
    await expect(list).toHaveTextContent('Website redesign')
    await expect(list).toHaveTextContent('$48,000.00')
    await expect(list).toHaveTextContent('Negotiation')
  },
}

export const DealsEmpty: Story = {
  decorators: [single('max-w-md')],
  render: () => (
    <DealsWidget deals={[]} emptyLabel="No open deals" title="Top deals" />
  ),
}

export const ActivityFeed: Story = {
  decorators: [single('max-w-md')],
  render: () => <RecentActivity />,
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Recent activity',
    })
    await expect(list).toHaveTextContent('Ana Martins called Acme Corp')
    await expect(list).toHaveTextContent('2 days ago')
  },
}

export const ContactCard: Story = {
  decorators: [single('max-w-md')],
  render: () => <Contact />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Ana Martins' })
    await expect(region).toHaveTextContent('Head of Operations · Acme Corp')
    await expect(canvas.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:ana.martins@acme.com',
    )
    await expect(canvas.getByRole('link', { name: 'Call' })).toHaveAttribute(
      'href',
      'tel:+1 415 555 0132',
    )
    await expect(
      canvas.getByRole('link', { name: 'WhatsApp' }),
    ).toHaveAttribute('href', 'https://wa.me/14155550132')
    await expect(
      canvas.getByRole('list', { name: 'Recent activity' }),
    ).toHaveTextContent('Gabriel Melo called Ana')
  },
}

export const ContactEmpty: Story = {
  decorators: [single('max-w-md')],
  render: () => <Contact activities={[]} />,
}
