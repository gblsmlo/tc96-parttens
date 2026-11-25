import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats2 } from '@tc96/ui/blocks/application/stats/stats-2'
import { fn } from 'storybook/test'
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

export const Default: Story = {}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}
