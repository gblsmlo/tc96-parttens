import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow4 } from '@tc96/ui/blocks/application/flow/flow-4'
import { fn } from 'storybook/test'
import { links, nodes } from '../fixtures/flow-4.ts'

const meta = {
  args: { links, nodes, onNodeSelect: fn(), onRetry: fn() },
  component: Flow4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow4/States',
} satisfies Meta<typeof Flow4>

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
  args: { links: [], nodes: [] },
}
