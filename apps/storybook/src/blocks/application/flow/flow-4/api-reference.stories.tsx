import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow4 } from '@tc96/ui/blocks/application/flow/flow-4'
import { fn } from 'storybook/test'
import { links, nodes } from '../fixtures/flow-4.ts'

const meta = {
  args: {
    links,
    nodes,
    onNodeSelect: fn(),
    onRetry: fn(),
    selectedId: 'onboarding',
  },
  component: Flow4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Flow/Flow4/API Reference',
} satisfies Meta<typeof Flow4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
