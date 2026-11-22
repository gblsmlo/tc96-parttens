import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { CrmCanvas } from './crm-canvas.tsx'
import {
  Contact,
  Kpis,
  LeadSources,
  RecentActivity,
  SalesPipeline,
  TopDeals,
} from './crm-layouts.tsx'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/CRM/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SalesDashboard: Story = {
  parameters: { layout: 'fullscreen' },
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
    await expect(
      canvas.getByRole('region', { name: 'Sales pipeline' }),
    ).toHaveTextContent('$271,900.00')
    await expect(
      canvas.getByRole('region', { name: 'Conversion rate' }),
    ).toHaveTextContent('24%')
    await expect(canvas.getByRole('list', { name: 'Top deals' })).toBeVisible()
  },
}

export const OpenPipeline: Story = {
  decorators: [CrmCanvas],
  render: () => <SalesPipeline />,
  play: async ({ canvasElement }) => {
    const widget = within(canvasElement).getByRole('region', {
      name: 'Sales pipeline',
    })
    await expect(widget).toHaveTextContent('Open pipeline value')
    await expect(widget).toHaveTextContent('$271,900.00')
    await expect(within(widget).getByRole('list')).toHaveTextContent('Won')
  },
}

export const TopOpenDeals: Story = {
  decorators: [CrmCanvas],
  render: () => <TopDeals />,
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Top deals' })
    await expect(list).toHaveTextContent('Website redesign')
    await expect(list).toHaveTextContent('$48,000.00')
    await expect(list).toHaveTextContent('Negotiation')
  },
}

export const RecentCustomerActivity: Story = {
  decorators: [CrmCanvas],
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
  decorators: [CrmCanvas],
  render: () => <Contact />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Ana Martins' }),
    ).toHaveTextContent('Head of Operations · Acme Corp')
    await expect(canvas.getByRole('link', { name: 'Email' })).toBeVisible()
    await expect(
      canvas.getByRole('list', { name: 'Recent activity' }),
    ).toHaveTextContent('Gabriel Melo called Ana')
  },
}
