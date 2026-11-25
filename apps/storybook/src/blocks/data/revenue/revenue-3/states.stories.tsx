import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue3 } from '@tc96/ui/blocks/data/revenue/revenue-3'
import { fn } from 'storybook/test'
import { accounts, regions, summary } from '../fixtures/revenue-3.ts'

const meta = {
  args: { accounts, onRetry: fn(), regions, summary },
  component: Revenue3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue3/States',
} satisfies Meta<typeof Revenue3>

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
