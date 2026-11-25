import type { Meta, StoryObj } from '@storybook/react-vite'
import { AiChat1 } from '@tc96/ui/blocks/ai-agents/ai-chat/ai-chat-1'
import { fn } from 'storybook/test'
import {
  copilotMessages,
  copilotModels,
  copilotStarters,
  copilotThreads,
} from '../fixtures/ai-chat-1.tsx'

const meta = {
  args: {
    messages: copilotMessages,
    models: copilotModels,
    onRetry: fn(),
    onSend: fn(),
    onStop: fn(),
    starters: copilotStarters,
    threadId: 'churn-query',
    threads: copilotThreads,
  },
  component: AiChat1,
  decorators: [
    (Story) => (
      <div className="flex h-svh flex-col">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/AI Chat/AiChat1/States',
} satisfies Meta<typeof AiChat1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Starter: Story = {
  args: { messages: [] },
}

export const Responding: Story = {
  args: {
    messages: copilotMessages.slice(0, 3),
    responding: true,
  },
}

export const Loading: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
}
