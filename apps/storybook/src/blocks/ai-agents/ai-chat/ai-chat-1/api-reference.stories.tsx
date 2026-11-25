import type { Meta, StoryObj } from '@storybook/react-vite'
import { AiChat1 } from '@tc96/ui/blocks/ai-agents/ai-chat/ai-chat-1'
import { fn } from 'storybook/test'
import {
  copilotAttachActions,
  copilotChips,
  copilotMessages,
  copilotModels,
  copilotStarters,
  copilotThreads,
  copilotUsage,
} from '../fixtures/ai-chat-1.tsx'

const meta = {
  args: {
    attachActions: copilotAttachActions,
    chips: copilotChips,
    messages: copilotMessages,
    model: 'atlas-pro',
    models: copilotModels,
    onAttach: fn(),
    onChipRemove: fn(),
    onCopy: fn(),
    onExport: fn(),
    onFeedback: fn(),
    onModelChange: fn(),
    onNewThread: fn(),
    onRegenerate: fn(),
    onSend: fn(),
    onThreadChange: fn(),
    onWebSearchChange: fn(),
    starters: copilotStarters,
    threadId: 'churn-query',
    threads: copilotThreads,
    usage: copilotUsage,
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
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/AI & Agents/AI Chat/AiChat1/API Reference',
} satisfies Meta<typeof AiChat1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}

export const Starter: Story = { args: { messages: [], threadId: undefined } }
