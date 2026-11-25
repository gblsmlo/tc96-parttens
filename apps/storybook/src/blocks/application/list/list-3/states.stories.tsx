import type { Meta, StoryObj } from '@storybook/react-vite'
import { List3 } from '@tc96/ui/blocks/application/list/list-3'
import { fn } from 'storybook/test'
import { transactions } from '../fixtures/list-3.ts'

const meta = {
  args: { onPeriodChange: fn(), period: 'month', transactions, onRetry: fn() },
  component: List3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List3/States',
} satisfies Meta<typeof List3>

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

export const Empty: Story = {
  args: { transactions: [] },
}
