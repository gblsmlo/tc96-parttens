import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow3 } from '@tc96/ui/blocks/application/flow/flow-3'
import { fn } from 'storybook/test'
import { connections, steps } from '../fixtures/flow-3.ts'

const meta = {
  args: {
    connections,
    onApprove: fn(),
    onReject: fn(),
    onReplay: fn(),
    onRetry: fn(),
    steps,
  },
  component: Flow3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Flow/Flow3/API Reference',
} satisfies Meta<typeof Flow3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
