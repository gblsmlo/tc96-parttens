import type { Meta, StoryObj } from '@storybook/react-vite'
import { List1 } from '@tc96/ui/blocks/application/list/list-1'
import { fn } from 'storybook/test'
import { metrics } from '../fixtures/list-1.ts'

const meta = {
  args: { metrics, onRetry: fn() },
  component: List1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List1/States',
} satisfies Meta<typeof List1>

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
