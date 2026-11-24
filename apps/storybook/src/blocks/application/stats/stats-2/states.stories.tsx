import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats2 } from '@tc96/ui/blocks/application/stats/stats-2'
import { expect, fn, within } from 'storybook/test'
import { quotaUsage } from '../fixtures/stats-2.ts'

const meta = {
  args: {
    className: 'mx-auto max-w-md',
    cost: quotaUsage.cost,
    limit: quotaUsage.limit,
    onUpgrade: fn(),
    renewsAt: new Date(quotaUsage.renewsAt),
    timeZone: 'UTC',
    used: quotaUsage.used,
    onRetry: fn(),
  },
  component: Stats2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats2/States',
} satisfies Meta<typeof Stats2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Uso da API' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando uso da API'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar o uso da API'),
    ).toBeVisible()
  },
}
