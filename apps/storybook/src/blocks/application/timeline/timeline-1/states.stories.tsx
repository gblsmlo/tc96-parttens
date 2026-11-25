import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline1 } from '@tc96/ui/blocks/application/timeline/timeline-1'
import { fn } from 'storybook/test'
import { events } from '../fixtures/timeline-1.ts'

const meta = {
  args: { events, onRetry: fn() },
  component: Timeline1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline1/States',
} satisfies Meta<typeof Timeline1>

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
  args: { events: [] },
}
