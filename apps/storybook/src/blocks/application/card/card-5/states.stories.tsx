import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card5 } from '@tc96/ui/blocks/application/card/card-5'
import { fn } from 'storybook/test'
import { shortcuts } from '../fixtures/card-5.ts'

const meta = {
  args: { onSelect: fn(), shortcuts, onRetry: fn() },
  component: Card5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card5/States',
} satisfies Meta<typeof Card5>

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
  args: { shortcuts: [] },
}
