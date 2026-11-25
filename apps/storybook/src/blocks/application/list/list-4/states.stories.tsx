import type { Meta, StoryObj } from '@storybook/react-vite'
import { List4 } from '@tc96/ui/blocks/application/list/list-4'
import { fn } from 'storybook/test'
import { integrations } from '../fixtures/list-4.ts'

const meta = {
  args: { integrations, onConnect: () => {}, onRetry: fn() },
  component: List4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List4/States',
} satisfies Meta<typeof List4>

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
  args: { integrations: [] },
}
