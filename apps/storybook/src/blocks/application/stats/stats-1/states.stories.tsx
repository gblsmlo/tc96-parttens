import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats1 } from '@tc96/ui/blocks/application/stats/stats-1'
import { fn } from 'storybook/test'
import { stats } from '../fixtures/stats-1.ts'

const meta = {
  args: { onStatAction: fn(), stats, onRetry: fn() },
  component: Stats1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats1/States',
} satisfies Meta<typeof Stats1>

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
  args: { stats: [] },
}
