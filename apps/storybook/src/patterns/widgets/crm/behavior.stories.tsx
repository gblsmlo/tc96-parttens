import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ActivityFeedWidget,
  ContactWidget,
  DealsWidget,
  PipelineWidget,
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const onPeriodChange = fn()

const meta = {
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
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PipelineSumsAndScalesStages: Story = {
  play: async ({ canvasElement }) => {
    onPeriodChange.mockClear()
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Sales pipeline' })
    await expect(region.textContent).toContain('$100,000.00')
    await expect(region.textContent).toContain('Total no funil')
    await expect(region.textContent).toContain('50.00%')
    const bars = [
      ...canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="pipeline-stage"] [aria-hidden] > div',
      ),
    ]
    await expect(bars.map((bar) => bar.style.width)).toEqual([
      '80%',
      '100%',
      '20%',
    ])
    await expect(bars[1]?.style.backgroundColor).toBe('var(--chart-2)')
    await expect(
      canvas.getByRole('list', { name: 'Sales pipeline' }).tagName,
    ).toBe('OL')
    await userEvent.click(canvas.getByRole('button', { name: 'Month' }))
    await expect(onPeriodChange).toHaveBeenCalledTimes(1)
    await expect(onPeriodChange).toHaveBeenCalledWith('month')
  },
  render: () => (
    <PipelineWidget
      onPeriodChange={onPeriodChange}
      period="quarter"
      periods={[
        { label: 'Month', value: 'month' },
        { label: 'Quarter', value: 'quarter' },
      ]}
      stages={[
        { count: 12, id: 'lead', label: 'Lead', value: 40000 },
        { count: 6, id: 'proposal', label: 'Proposal', value: 50000 },
        { count: 2, id: 'won', label: 'Won', value: 10000 },
      ]}
      title="Sales pipeline"
    />
  ),
}

export const DealsListStageOwnerAndValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('list', { name: 'Top deals' })
    await expect(list).toHaveAttribute('data-slot', 'deal-list')
    await expect(
      list.querySelectorAll('[data-slot="deal-list-item"]'),
    ).toHaveLength(2)
    await expect(list.textContent).toContain('$48,000.00')
    await expect(list.textContent).toContain('$12,500.50')
    await expect(list.textContent).toContain('Acme Corp')
    await expect(list.textContent).toContain('Closes Jun 30')
    const stages = [
      ...canvasElement.querySelectorAll('[data-slot="deal-stage"]'),
    ]
    await expect(stages.map((stage) => stage.textContent)).toEqual([
      'Negotiation',
      'Won',
    ])
    await expect(stages[0]).toHaveClass('text-warning-foreground')
    await expect(
      canvas.getByRole('list', { name: 'Responsável' }).textContent,
    ).toBe('AMAna Martins')
  },
  render: () => (
    <DealsWidget
      deals={[
        {
          closeLabel: 'Closes Jun 30',
          company: 'Acme Corp',
          id: 'acme',
          name: 'Website redesign',
          owner: { id: 'ana', label: 'Ana Martins' },
          stage: { label: 'Negotiation', tone: 'warning' },
          value: 48000,
        },
        {
          id: 'globex',
          name: 'Annual license',
          stage: { label: 'Won', tone: 'success' },
          value: 12500.5,
        },
      ]}
      title="Top deals"
    />
  ),
}

export const DealsEmptyLabelWithoutList: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('list')).toBeNull()
    await expect(canvas.getByText('Nothing open')).toHaveAttribute(
      'data-slot',
      'deals-empty',
    )
  },
  render: () => (
    <DealsWidget deals={[]} emptyLabel="Nothing open" title="Deals" />
  ),
}

export const ActivityFeedNamesPersonAndTonesIcon: Story = {
  play: async ({ canvasElement }) => {
    const items = [
      ...canvasElement.querySelectorAll('[data-slot="activity-feed-item"]'),
    ]
    await expect(items).toHaveLength(2)
    await expect(items[0]?.textContent).toContain(
      'Ana Martins called Acme Corp',
    )
    await expect(items[0]?.textContent).toContain('Discussed renewal terms.')
    await expect(items[0]?.textContent).toContain('2h ago')
    await expect(
      canvasElement.querySelector('[data-slot="activity-feed-icon"]'),
    ).toHaveClass('text-success-foreground')
    await expect(
      items[1]?.querySelector('[data-slot="activity-feed-icon"]'),
    ).toBeNull()
    await expect(
      within(canvasElement).getByRole('list', { name: 'Recent activity' })
        .tagName,
    ).toBe('OL')
  },
  render: () => (
    <ActivityFeedWidget
      activities={[
        {
          description: 'Discussed renewal terms.',
          icon: <svg aria-hidden="true" />,
          id: 'call',
          person: { id: 'ana', label: 'Ana Martins' },
          timeLabel: '2h ago',
          title: 'called Acme Corp',
          tone: 'success',
        },
        {
          id: 'mail',
          person: { id: 'gabriel', label: 'Gabriel Melo' },
          timeLabel: 'Yesterday',
          title: 'sent a proposal',
        },
      ]}
      title="Recent activity"
    />
  ),
}

export const ContactLinksChannelsAndReusesTimeline: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Ana Martins' })
    await expect(region.textContent).toContain('Head of Ops · Acme Corp')
    await expect(region.textContent).toContain('VIP')
    await expect(canvas.getByRole('link', { name: 'E-mail' })).toHaveAttribute(
      'href',
      'mailto:ana@acme.com',
    )
    await expect(
      canvas.getByRole('link', { name: 'WhatsApp' }),
    ).toHaveAttribute('href', 'https://wa.me/5511987654321')
    await expect(canvas.queryByRole('link', { name: 'Ligar' })).toBeNull()
    await expect(
      canvas.getByRole('list', { name: 'Atividade recente' }).textContent,
    ).toContain('Ana Martins called about the renewal')
    await expect(
      canvasElement.querySelectorAll('[data-slot="activity-feed-item"]'),
    ).toHaveLength(1)
  },
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
      company="Acme Corp"
      email="ana@acme.com"
      jobTitle="Head of Ops"
      person={{ id: 'ana', label: 'Ana Martins' }}
      tags={[{ id: 'vip', label: 'VIP' }]}
      whatsapp="+55 (11) 98765-4321"
    />
  ),
}

export const ContactEmptyActivity: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Ligar' })).toHaveAttribute(
      'href',
      'tel:+5511912345678',
    )
    await expect(canvas.getByText('Nenhum contato ainda')).toBeVisible()
  },
  render: () => (
    <ContactWidget
      activities={[]}
      emptyLabel="Nenhum contato ainda"
      person={{ id: 'joao', label: 'João Lima' }}
      phone="+5511912345678"
    />
  ),
}
