import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats3 } from '@tc96/ui/blocks/application/stats/stats-3'
import { fn } from 'storybook/test'
import { capacity } from '../fixtures/stats-3.ts'

const meta = {
  args: { items: capacity, onRetry: fn() },
  component: Stats3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats3/States',
} satisfies Meta<typeof Stats3>

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
