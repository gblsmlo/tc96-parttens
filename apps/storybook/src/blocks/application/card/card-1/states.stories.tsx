import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card1 } from '@tc96/ui/blocks/application/card/card-1'
import { fn } from 'storybook/test'
import { facts } from '../fixtures/card-1.ts'

const meta = {
  args: { facts, onRetry: fn() },
  component: Card1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card1/States',
} satisfies Meta<typeof Card1>

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
