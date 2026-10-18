import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  ChatEmptyState,
  ChatLoadingState,
  ChatStatusBar,
} from '@tc96/ui/chat/chat-states'
import { MessagesSquareIcon, ShieldOffIcon } from 'lucide-react'
import { expect, fn, userEvent } from 'storybook/test'

interface StatesArgs {
  onAction: () => void
}

const meta = {
  args: { onAction: fn() },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'States that replace or annotate the timeline. The consumer decides which one applies: not joined shows only the join introduction, loading keeps the composer disabled, disconnected keeps the cached history above a status bar, and access lost shows no history and no composer.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/States',
} satisfies Meta<StatesArgs>

export default meta
type Story = StoryObj<typeof meta>

export const NotJoined: Story = {
  render: ({ onAction }) => (
    <ChatEmptyState
      description="Join to read the history and send messages."
      icon={<MessagesSquareIcon aria-hidden="true" />}
      title="Product launch"
    >
      <Button onClick={onAction}>Join conversation</Button>
    </ChatEmptyState>
  ),
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Product launch')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Join conversation' }),
    )
    await expect(args.onAction).toHaveBeenCalledTimes(1)
  },
}

export const AccessLost: Story = {
  render: () => (
    <ChatEmptyState
      description="You no longer have access to this conversation."
      icon={<ShieldOffIcon aria-hidden="true" />}
      title="Access removed"
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const Loading: Story = {
  render: () => <ChatLoadingState label="Loading messages" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Loading messages',
    )
  },
}

export const Disconnected: Story = {
  render: ({ onAction }) => (
    <ChatStatusBar
      action={
        <Button onClick={onAction} size="sm" variant="outline">
          Reconnect
        </Button>
      }
      description="Messages you send will wait until the connection is back."
      title="Offline"
    />
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reconnect' }))
    await expect(args.onAction).toHaveBeenCalledTimes(1)
  },
}
