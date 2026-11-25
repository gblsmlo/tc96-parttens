import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support4 } from '@tc96/ui/blocks/data/support/support-4'
import { fn } from 'storybook/test'
import { rules } from '../fixtures/support-4.ts'

const meta = {
  args: { onRetry: fn(), rules },
  component: Support4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support4/States',
} satisfies Meta<typeof Support4>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Reordered: Story = {
  args: { onResetOrder: fn(), onRuleMove: fn(), orderChanged: true },
}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { rules: [] },
}
