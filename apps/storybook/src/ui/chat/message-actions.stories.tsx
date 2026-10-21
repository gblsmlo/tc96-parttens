import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { ChatMessageActionToolbar } from '@tc96/ui/chat/chat-message-actions'
import { ChatReactionChip } from '@tc96/ui/chat/chat-reaction-chip'
import { ChatReactionPicker } from '@tc96/ui/chat/chat-reaction-picker'
import { MenuItem } from '@tc96/ui/menu'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'

const reactionOptions = [
  { emoji: '👍', label: 'Thumbs up' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '😂', label: 'Laughing' },
  { emoji: '🎉', label: 'Party' },
] as const

interface Reaction {
  count: number
  emoji: string
  mine: boolean
}

function labelOf(emoji: string) {
  return reactionOptions.find((option) => option.emoji === emoji)?.label ?? ''
}

function toggleReaction(reactions: Reaction[], emoji: string): Reaction[] {
  const current = reactions.find((reaction) => reaction.emoji === emoji)
  if (!current) return [...reactions, { count: 1, emoji, mine: true }]
  return reactions
    .map((reaction) =>
      reaction.emoji === emoji
        ? {
            ...reaction,
            count: reaction.count + (reaction.mine ? -1 : 1),
            mine: !reaction.mine,
          }
        : reaction,
    )
    .filter((reaction) => reaction.count > 0)
}

interface MessageActionsArgs {
  onCopy: () => void
  onReply: () => void
  side: 'incoming' | 'outgoing'
}

const meta = {
  args: {
    onCopy: fn(),
    onReply: fn(),
    side: 'incoming',
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['incoming', 'outgoing'] },
  },
  decorators: [
    (Story) => (
      <div className="w-96 pt-16">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'The message action toolbar with a reaction picker, a reply button and a menu, plus the reaction chips under the bubble. The toolbar shows on hover or focus. The picker opens toward the bubble: `popupAlign="end"` for an incoming message, `start` for an outgoing one; the reactor popup of a chip uses the opposite.',
      },
    },
  },
  render: function MessageActions({ onCopy, onReply, side }) {
    const [reactions, setReactions] = useState<Reaction[]>([
      { count: 2, emoji: '🎉', mine: false },
    ])
    const select = (emoji: string) =>
      setReactions((current) => toggleReaction(current, emoji))
    const incoming = side === 'incoming'

    return (
      <ChatMessage
        actions={
          <ChatMessageActionToolbar
            menuChildren={<MenuItem onClick={onCopy}>Copy text</MenuItem>}
            moreLabel="More actions"
            moreTooltip="More"
            onReply={onReply}
            reactionPicker={(toolbarRef) => (
              <ChatReactionPicker
                inToolbar
                onSelect={select}
                options={reactionOptions}
                popupAlign={incoming ? 'end' : 'start'}
                popupAnchor={toolbarRef}
                popupLabel="Reactions"
                selectedEmojis={reactions
                  .filter((reaction) => reaction.mine)
                  .map((reaction) => reaction.emoji)}
                triggerLabel="Add reaction"
                triggerTooltip="React"
              />
            )}
            replyLabel="Reply"
            replyTooltip="Reply"
            side={side}
            toolbarLabel="Message actions"
          />
        }
        author="Casey"
        avatar={
          <Avatar aria-hidden="true" className="size-7 text-xs">
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        }
        reactions={reactions.map((reaction) => (
          <ChatReactionChip
            count={reaction.count}
            emoji={reaction.emoji}
            key={reaction.emoji}
            label={`${labelOf(reaction.emoji)}, ${reaction.count}`}
            onClick={() => select(reaction.emoji)}
            popupAlign={incoming ? 'start' : 'end'}
            reactorContent={
              <p className="m-0 p-1 text-sm">
                {reaction.mine ? 'You and others' : 'Jordan, Sam'}
              </p>
            }
            reactorLabel={`Reacted with ${labelOf(reaction.emoji)}`}
            selected={reaction.mine}
          />
        ))}
        side={side}
      >
        The new onboarding flow ships on Friday.
      </ChatMessage>
    )
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Message Actions',
} satisfies Meta<MessageActionsArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outgoing: Story = { args: { side: 'outgoing' } }

export const AddReaction: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add reaction' }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Thumbs up' }),
    )
    const chip = await canvas.findByRole('button', { name: 'Thumbs up, 1' })
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(chip)
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Thumbs up, 1' })).toBeNull(),
    )
  },
}

export const ToggleExistingReaction: Story = {
  play: async ({ canvas }) => {
    const party = canvas.getByRole('button', { name: 'Party, 2' })
    await expect(party).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(party)
    await expect(
      await canvas.findByRole('button', { name: 'Party, 3' }),
    ).toHaveAttribute('aria-pressed', 'true')
  },
}

export const ReplyAndMenu: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reply' }))
    await expect(args.onReply).toHaveBeenCalledTimes(1)
    await userEvent.click(canvas.getByRole('button', { name: 'More actions' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Copy text' }),
    )
    await expect(args.onCopy).toHaveBeenCalledTimes(1)
  },
}
