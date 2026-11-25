import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support2 } from '@tc96/ui/blocks/data/support/support-2'
import { fn } from 'storybook/test'
import { tickets } from '../fixtures/support-2.ts'

const meta = {
  args: { onRetry: fn(), pageSize: 6, pageSizeOptions: [6, 12, 24], tickets },
  component: Support2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support2/States',
} satisfies Meta<typeof Support2>

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
