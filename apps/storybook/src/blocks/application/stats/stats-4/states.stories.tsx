import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats4 } from '@tc96/ui/blocks/application/stats/stats-4'
import { fn } from 'storybook/test'
import { leadsOverview } from '../fixtures/stats-4.ts'

const meta = {
  args: {
    goal: leadsOverview.goal,
    onRangeChange: fn(),
    range: '30d',
    sources: leadsOverview.sources,
    total: leadsOverview.total,
    onRetry: fn(),
  },
  component: Stats4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats4/States',
} satisfies Meta<typeof Stats4>

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
