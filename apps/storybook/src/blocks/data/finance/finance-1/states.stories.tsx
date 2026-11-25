import type { Meta, StoryObj } from '@storybook/react-vite'
import { Finance1 } from '@tc96/ui/blocks/data/finance/finance-1'
import { fn } from 'storybook/test'
import { finance1TotalCount, transactions } from '../fixtures/finance-1.ts'

const meta = {
  args: {
    onRetry: fn(),
    totalCount: finance1TotalCount,
    transactions,
  },
  component: Finance1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance1/States',
} satisfies Meta<typeof Finance1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    onFlag: fn(),
    onRefund: fn(),
    selectedIds: transactions.slice(0, 2).map((transaction) => transaction.id),
  },
}

export const Loading: Story = {
  args: { pending: true },
}

export const LoadingMore: Story = {
  args: { hasMore: true, loadingMore: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { totalCount: 0, transactions: [] },
}
