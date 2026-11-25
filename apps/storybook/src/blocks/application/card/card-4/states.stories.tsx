import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card4 } from '@tc96/ui/blocks/application/card/card-4'
import { fn } from 'storybook/test'
import { meetings } from '../fixtures/card-4.ts'

const meta = {
  args: { meetings, onJoin: fn(), onRetry: fn() },
  component: Card4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card4/States',
} satisfies Meta<typeof Card4>

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
  args: { meetings: [] },
}
