import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats6 } from '@tc96/ui/blocks/application/stats/stats-6'
import { fn } from 'storybook/test'
import { sleeves } from '../fixtures/stats-6.ts'

const meta = {
  args: { onPeriodChange: fn(), period: 'month', sleeves, onRetry: fn() },
  component: Stats6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats6/States',
} satisfies Meta<typeof Stats6>

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
