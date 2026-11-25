import type { Meta, StoryObj } from '@storybook/react-vite'
import { List5 } from '@tc96/ui/blocks/application/list/list-5'
import { fn } from 'storybook/test'
import { modules } from '../fixtures/list-5.ts'

const meta = {
  args: { modules, onAdd: () => {}, onBrowseMore: () => {}, onRetry: fn() },
  component: List5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List5/States',
} satisfies Meta<typeof List5>

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
