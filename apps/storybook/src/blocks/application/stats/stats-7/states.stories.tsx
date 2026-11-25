import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats7 } from '@tc96/ui/blocks/application/stats/stats-7'
import { fn } from 'storybook/test'
import { stats7Metrics } from '../fixtures/stats-7.ts'

const meta = {
  args: { metrics: stats7Metrics, onRetry: fn() },
  component: Stats7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats7/States',
} satisfies Meta<typeof Stats7>

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
  args: { metrics: [] },
}
