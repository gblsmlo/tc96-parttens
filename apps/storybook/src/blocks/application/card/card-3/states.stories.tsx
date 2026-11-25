import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card3 } from '@tc96/ui/blocks/application/card/card-3'
import { fn } from 'storybook/test'
import { profile } from '../fixtures/card-3.ts'

const meta = {
  args: { onFollow: () => {}, onMessage: () => {}, profile, onRetry: fn() },
  component: Card3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card3/States',
} satisfies Meta<typeof Card3>

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
