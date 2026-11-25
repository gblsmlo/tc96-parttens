import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support3 } from '@tc96/ui/blocks/data/support/support-3'
import { fn } from 'storybook/test'
import { rules } from '../fixtures/support-3.ts'

const meta = {
  args: { onRetry: fn(), rules },
  component: Support3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support3/States',
} satisfies Meta<typeof Support3>

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
