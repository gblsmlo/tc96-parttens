import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline3 } from '@tc96/blocks/application/timeline/timeline-3'
import { fn } from 'storybook/test'
import { approvalSteps, currentStepId } from '../fixtures/timeline-3.ts'

const meta = {
  args: {
    currentStepId,
    onApprove: fn(),
    onReject: fn(),
    steps: approvalSteps,
  },
  component: Timeline3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Timeline/Timeline3/API Reference',
} satisfies Meta<typeof Timeline3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
