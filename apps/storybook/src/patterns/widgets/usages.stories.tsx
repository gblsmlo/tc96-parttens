import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { WidgetsCanvas } from './widgets-canvas.tsx'
import { RecentOrders, RevenueSummary } from './widgets-layouts.tsx'

const meta = {
  decorators: [WidgetsCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const StoreRevenue: Story = {
  render: () => <RevenueSummary />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Store revenue',
    })
    await expect(card).toHaveTextContent('$48,250.75')
    await expect(card).toHaveTextContent('Alta de 12.40%')
    await expect(
      within(card).getByRole('group', { name: 'Revenue period' }),
    ).toBeVisible()
  },
}

export const OrdersFeed: Story = {
  render: () => <RecentOrders />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Recent orders',
    })
    await expect(card).toHaveTextContent('Order #4821')
    await expect(card).toHaveTextContent('Ana Martins')
    await expect(
      within(card).getByRole('button', { name: 'Ver todas (+3)' }),
    ).toBeVisible()
  },
}
