import type { Meta, StoryObj } from '@storybook/react-vite'
import { List6 } from '@tc96/ui/blocks/application/list/list-6'
import { fn } from 'storybook/test'
import { movers } from '../fixtures/list-6.ts'

const meta = {
  args: { movers, onQueryChange: () => {}, query: '', onRetry: fn() },
  component: List6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List6/States',
} satisfies Meta<typeof List6>

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
  args: { movers: [] },
}
