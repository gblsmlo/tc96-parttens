import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { ChatCollapsibleMessage } from '@tc96/ui/chat/chat-collapsible-message'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { ChatMessageText } from '@tc96/ui/chat/chat-message-text'
import { ChatReplyReference } from '@tc96/ui/chat/chat-reply-reference'
import { expect, fn, userEvent } from 'storybook/test'

const longText = Array.from(
  { length: 6 },
  (_, index) =>
    `Section ${index + 1}: the onboarding flow asks for the workspace name, then invites the team and finally connects the calendar. Each step keeps the previous answers so nobody types twice.`,
).join('\n\n')

function CaseyAvatar() {
  return (
    <Avatar aria-hidden="true" className="size-7 text-xs">
      <AvatarFallback>C</AvatarFallback>
    </Avatar>
  )
}

const meta = {
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
          'Message bodies beyond plain text: long text behind a show more trigger and the quoted message of a reply.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Content',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const CollapsibleMessage: Story = {
  render: () => (
    <ChatMessage author="Casey" avatar={<CaseyAvatar />} side="incoming">
      <ChatCollapsibleMessage
        renderText={(text) => (
          <ChatMessageText mentions={['Jordan']} text={text} />
        )}
        showLessLabel="Show less"
        showMoreLabel="Show more"
        side="incoming"
        text={`@Jordan here is the full walkthrough.\n\n${longText}`}
      />
    </ChatMessage>
  ),
  play: async ({ canvas }) => {
    const more = canvas.getByRole('button', { name: 'Show more' })
    await expect(more).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(more)
    const less = canvas.getByRole('button', { name: 'Show less' })
    await expect(less).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(less)
    await expect(
      canvas.getByRole('button', { name: 'Show more' }),
    ).toBeVisible()
  },
}

export const ShortTextIsNotCollapsed: Story = {
  render: () => (
    <ChatMessage side="outgoing">
      <ChatCollapsibleMessage
        showLessLabel="Show less"
        showMoreLabel="Show more"
        side="outgoing"
        text="Short notes stay whole."
      />
    </ChatMessage>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Show more' })).toBeNull()
  },
}

const onQuoteClick = fn()

export const ReplyReference: Story = {
  render: () => (
    <ChatMessage side="outgoing">
      <ChatReplyReference
        author="Casey"
        onClick={onQuoteClick}
        preview="Can you review the onboarding copy before Friday?"
      />
      <ChatMessageText text="Yes, notes are coming tomorrow." />
    </ChatMessage>
  ),
  play: async ({ canvas }) => {
    onQuoteClick.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: /Casey/ }))
    await expect(onQuoteClick).toHaveBeenCalledTimes(1)
  },
}
