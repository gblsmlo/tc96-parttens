import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue1 } from '@tc96/ui/blocks/data/revenue/revenue-1'
import { fn } from 'storybook/test'
import { renewals } from '../fixtures/revenue-1.ts'

const meta = {
  args: { onRetry: fn(), pageSize: 8, renewals },
  component: Revenue1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue1/States',
} satisfies Meta<typeof Revenue1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: { selectedIds: ['atlas', 'base-nuvem'] },
}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { renewals: [] },
}
