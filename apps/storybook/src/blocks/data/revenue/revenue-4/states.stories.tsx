import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue4 } from '@tc96/ui/blocks/data/revenue/revenue-4'
import { fn } from 'storybook/test'
import { accounts, regions, summary } from '../fixtures/revenue-4.ts'

const meta = {
  args: { accounts, onRetry: fn(), regions, summary },
  component: Revenue4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue4/States',
} satisfies Meta<typeof Revenue4>

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
  args: { accounts: [] },
}
