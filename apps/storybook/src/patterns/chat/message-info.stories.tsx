import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { ChatMessageBubble } from '@tc96/ui/chat/chat-message-bubble'
import { ChatMessageInfo } from '@tc96/ui/chat/chat-message-info'
import { ChatMessageText } from '@tc96/ui/chat/chat-message-text'
import { CheckCheckIcon, CheckIcon } from 'lucide-react'
import { expect } from 'storybook/test'

function person(name: string) {
  return {
    avatar: (
      <Avatar aria-hidden="true" className="size-7 text-xs">
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
    id: name,
    name,
  }
}

const meta = {
  args: {
    groups: [
      {
        icon: <CheckCheckIcon aria-hidden="true" className="size-3.5" />,
        id: 'read',
        label: 'Read by',
        members: [person('Casey')],
      },
      {
        icon: <CheckIcon aria-hidden="true" className="size-3.5" />,
        id: 'delivered',
        label: 'Delivered to',
        members: [person('Jordan'), person('Sam')],
      },
    ],
    message: (
      <ChatMessageBubble side="outgoing">
        <ChatMessageText text="The new onboarding flow ships on Friday." />
      </ChatMessageBubble>
    ),
    metadata: 'Today, 09:42',
  },
  component: ChatMessageInfo,
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
          'The receipts of one sent message: the message, its metadata and one member section per group. A group without members is left out.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Message Info',
} satisfies Meta<typeof ChatMessageInfo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Read by' })).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Delivered to' }),
    ).toBeVisible()
  },
}

export const NobodyReadYet: Story = {
  args: {
    groups: [
      { id: 'read', label: 'Read by', members: [] },
      {
        icon: <CheckIcon aria-hidden="true" className="size-3.5" />,
        id: 'delivered',
        label: 'Delivered to',
        members: [person('Casey'), person('Jordan'), person('Sam')],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('region', { name: 'Read by' })).toBeNull()
  },
}
