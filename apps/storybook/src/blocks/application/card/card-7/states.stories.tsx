import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card7 } from '@tc96/ui/blocks/application/card/card-7'
import { fn } from 'storybook/test'
import { contact, items, stats } from '../fixtures/card-7.tsx'

const meta = {
  args: {
    className: 'max-w-sm',
    contact,
    items,
    onAction: fn(),
    onRetry: fn(),
    stats,
  },
  component: Card7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card7/States',
} satisfies Meta<typeof Card7>

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
