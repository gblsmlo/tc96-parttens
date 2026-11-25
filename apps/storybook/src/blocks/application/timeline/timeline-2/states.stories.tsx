import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline2 } from '@tc96/ui/blocks/application/timeline/timeline-2'
import { fn } from 'storybook/test'
import { releases } from '../fixtures/timeline-2.ts'

const meta = {
  args: { onRetry: fn(), releases },
  component: Timeline2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline2/States',
} satisfies Meta<typeof Timeline2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { releases: [] },
}
