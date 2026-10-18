import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  type ChatMemberEntry,
  ChatMemberSection,
} from '@tc96/ui/chat/chat-members'
import { ChatMessageBubble } from '@tc96/ui/chat/chat-message-bubble'
import { ChatMessageInfo } from '@tc96/ui/chat/chat-message-info'
import { ChatMessageText } from '@tc96/ui/chat/chat-message-text'
import { CheckCheckIcon, CheckIcon } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

function memberAvatar(name: string) {
  return (
    <Avatar aria-hidden="true" className="size-7 text-xs">
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}

interface PeopleArgs {
  onRemove: (name: string) => void
}

const meta = {
  args: { onRemove: fn((_name: string) => {}) },
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
          'Member rows with consumer actions, and the receipt groups of one message. `dimmed` marks a member who left; the action slot holds whatever the consumer allows.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/People',
} satisfies Meta<PeopleArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Members: Story = {
  render: ({ onRemove }) => {
    const members: ChatMemberEntry[] = ['Casey', 'Jordan', 'Sam'].map(
      (name) => ({
        action: (
          <Button
            aria-label={`Remove ${name}`}
            onClick={() => onRemove(name)}
            size="xs"
            variant="ghost"
          >
            Remove
          </Button>
        ),
        avatar: memberAvatar(name),
        badges:
          name === 'Casey' ? <Badge variant="outline">Owner</Badge> : null,
        dimmed: name === 'Sam',
        id: name,
        name,
      }),
    )
    return (
      <ChatMemberSection
        heading="Members · 3"
        label="Members"
        members={members}
      />
    )
  },
  play: async ({ args, canvas }) => {
    const section = canvas.getByRole('region', { name: 'Members' })
    await expect(within(section).getAllByRole('listitem')).toHaveLength(3)
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Jordan' }))
    await expect(args.onRemove).toHaveBeenCalledWith('Jordan')
  },
}

export const MessageInfo: Story = {
  render: () => (
    <ChatMessageInfo
      groups={[
        {
          icon: <CheckCheckIcon aria-hidden="true" className="size-3.5" />,
          id: 'read',
          label: 'Read by',
          members: [
            { avatar: memberAvatar('Casey'), id: 'casey', name: 'Casey' },
          ],
        },
        {
          icon: <CheckIcon aria-hidden="true" className="size-3.5" />,
          id: 'delivered',
          label: 'Delivered to',
          members: [
            { avatar: memberAvatar('Jordan'), id: 'jordan', name: 'Jordan' },
            { avatar: memberAvatar('Sam'), id: 'sam', name: 'Sam' },
          ],
        },
        { id: 'pending', label: 'Pending', members: [] },
      ]}
      message={
        <ChatMessageBubble side="outgoing">
          <ChatMessageText text="The new onboarding flow ships on Friday." />
        </ChatMessageBubble>
      }
      metadata="Today, 09:42"
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Read by' })).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Delivered to' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('region', { name: 'Pending' })).toBeNull()
  },
}
