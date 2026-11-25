import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support1 } from '@tc96/ui/blocks/data/support/support-1'
import { fn } from 'storybook/test'
import { tickets } from '../fixtures/support-1.ts'

const meta = {
  args: { onRetry: fn(), pageSize: 6, pageSizeOptions: [6, 12, 24], tickets },
  component: Support1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support1/States',
} satisfies Meta<typeof Support1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: { selectedIds: ['sup-1831', 'sup-1793'] },
}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { tickets: [] },
}
