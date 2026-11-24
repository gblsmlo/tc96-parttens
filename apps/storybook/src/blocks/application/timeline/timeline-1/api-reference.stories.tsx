import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline1 } from '@tc96/blocks/application/timeline/timeline-1'
import { fn } from 'storybook/test'
import { events } from '../fixtures/timeline-1.ts'

const meta = {
  args: { events, onRetry: fn() },
  component: Timeline1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Timeline/Timeline1/API Reference',
} satisfies Meta<typeof Timeline1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
