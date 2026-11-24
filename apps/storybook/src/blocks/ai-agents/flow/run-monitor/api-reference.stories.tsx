import type { Meta, StoryObj } from '@storybook/react-vite'
import { RunMonitor } from '@tc96/ui/blocks/ai-agents/flow/run-monitor'
import { fn } from 'storybook/test'
import { connections, steps } from '../fixtures/run-monitor.ts'

const meta = {
  args: {
    connections,
    onApprove: fn(),
    onReject: fn(),
    onReplay: fn(),
    onRetry: fn(),
    steps,
  },
  component: RunMonitor,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/AI & Agents/Flow/RunMonitor/API Reference',
} satisfies Meta<typeof RunMonitor>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
