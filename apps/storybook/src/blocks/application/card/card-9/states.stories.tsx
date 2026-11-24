import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card9 } from '@tc96/ui/blocks/application/card/card-9'
import { fn } from 'storybook/test'
import { delivery, deliveryActions } from '../fixtures/card-9.ts'

const meta = {
  args: {
    actions: deliveryActions,
    className: 'max-w-md',
    delivery,
    onActionSelect: fn(),
    onRetry: fn(),
  },
  component: Card9,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card9/States',
} satisfies Meta<typeof Card9>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = { args: { pending: true } }

export const ErrorState: Story = { args: { error: true }, name: 'Error' }
