import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { ChatDeliveryIndicator } from '@tc96/ui/chat/chat-delivery-indicator'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { ChatMessageText } from '@tc96/ui/chat/chat-message-text'
import { expect, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'

const usage = `
import { ChatConversation } from '@acme/ui/chat/chat-conversation'
import { ChatMessage } from '@acme/ui/chat/chat-message'
import { useChatScroll } from '@acme/ui/chat/hooks/use-chat-scroll'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  getComposerText,
} from '@acme/ui/composer'

const scroll = useChatScroll({ itemCount: messages.length })

<ChatConversation jumpLabel="Jump to latest" label="Conversation" scroll={scroll}>
  {messages.map((message) => (
    <ChatMessage
      author={message.author}
      avatar={<Avatar aria-hidden="true">…</Avatar>}
      footer={message.time}
      key={message.id}
      side={message.own ? 'outgoing' : 'incoming'}
    >
      {message.text}
    </ChatMessage>
  ))}
</ChatConversation>
<Composer
  onSubmit={(value) => {
    scroll.atBottomRef.current = true
    send(getComposerText(value).trim())
  }}
  onValueChange={setDraft}
  submitOnEnter="desktop"
  value={draft}
>
  <ComposerInput aria-label="Message" render={<textarea />} />
  <ComposerActions>
    <ComposerActionGroup align="end">
      <ComposerSubmit render={<Button aria-label="Send message" size="icon" />} />
    </ComposerActionGroup>
  </ComposerActions>
</Composer>
`

const docs = {
  api: [
    {
      description:
        'Scroll viewport of the timeline, a labeled `role="log"`. Takes the `useChatScroll` controller, the `label` and the `jumpLabel` of the jump to latest button. `overlay` holds the reply preview and `inactive` makes the timeline inert under it; `live="off"` when the consumer announces new messages itself.',
      name: 'ChatConversation',
    },
    {
      description:
        'Scroll controller for one conversation: `itemCount`, `layoutKey`, `active`, `paused` and `onReachEnd`. Set `atBottomRef.current = true` before appending an own message and call `resetScroll` when the room changes.',
      name: 'useChatScroll',
    },
    {
      description:
        'One incoming or outgoing row. `side` and `children` are required; `author`, `avatar`, `actions`, `reactions` and `footer` are slots. `grouped` hides the repeated author and avatar, `bubble={false}` renders the children without a bubble, and a string child renders through `ChatMessageText`.',
      name: 'ChatMessage',
    },
    {
      description:
        'Message text with `mentions` (known handles without `@`) set in bold. Pass it as the child of `ChatMessage` when the message has mentions.',
      name: 'ChatMessageText',
    },
    {
      description:
        'Long text cut at `maxPreviewLength` (500) with a show more trigger. Requires `text`, `side`, `showMoreLabel` and `showLessLabel`; `renderText` keeps the mention formatting.',
      name: 'ChatCollapsibleMessage',
    },
    {
      description:
        'Quoted message above a reply. `onClick` hands the navigation to the consumer, which scrolls to the source and sets `highlighted` on it.',
      name: 'ChatReplyReference',
    },
    {
      description:
        'Reply, reaction and menu controls that show on hover or focus. `reactionPicker` receives the toolbar ref for `popupAnchor`; the reply and menu groups each need their label and tooltip.',
      name: 'ChatMessageActionToolbar',
    },
    {
      description:
        '`ChatReactionPicker` chooses an emoji from `options`; `ChatReactionChip` is one controlled reaction (`selected`, `count`, `onClick`) with an optional reactor list in `reactorContent`.',
      name: 'ChatReactionPicker, ChatReactionChip',
    },
    {
      description:
        'Focused reply over the timeline, in the conversation `overlay` inside `AnimatePresence`. Takes the measured `target`, `dismissalRef` (`cancel` or `send`) and `onCancel`.',
      name: 'ChatReplyPreview',
    },
    {
      description:
        '`ChatDatePill`, `ChatUnreadDivider`, `ChatTypingIndicator` and `ChatDeliveryIndicator` mark the timeline: sticky dates, the unread boundary, who is typing and the `status` of a sent message.',
      name: 'Timeline',
    },
    {
      description:
        '`ChatEmptyState`, `ChatLoadingState` and `ChatStatusBar` replace or annotate the timeline while joining, loading, disconnected or without access.',
      name: 'States',
    },
    {
      description:
        '`ChatMemberList` and `ChatMemberSection` render member rows with supplied actions; `ChatMessageInfo` groups the recipients of one message.',
      name: 'People',
    },
  ],
  description: {
    component:
      'COSS Chat, unmodified. Composable chat parts imported from their own files under `chat/`, with no global provider: the consumer owns the messages, the draft and every action. The input is the COSS `Composer`.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function CaseyAvatar() {
  return (
    <Avatar aria-hidden="true" className="size-7 text-xs">
      <AvatarFallback>C</AvatarFallback>
    </Avatar>
  )
}

const meta = {
  args: {
    author: 'Casey',
    avatar: <CaseyAvatar />,
    children: 'Can you review the onboarding copy before Friday?',
    side: 'incoming',
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['incoming', 'outgoing'] },
    grouped: { control: 'boolean' },
    bubble: { control: 'boolean' },
    animateEntrance: { control: 'boolean' },
    highlighted: { control: 'boolean' },
  },
  component: ChatMessage,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'UI/Chat',
} satisfies Meta<typeof ChatMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Incoming: Story = {
  play: async ({ canvas, canvasElement }) => {
    const message = canvasElement.querySelector('[data-slot="chat-message"]')
    await expect(message).toHaveAttribute('data-align', 'start')
    await expect(canvas.getByText('Casey')).toBeVisible()
  },
}

export const Outgoing: Story = {
  args: {
    children: 'Sure, I will send notes tomorrow morning.',
    footer: (
      <>
        <span>09:42</span>
        <ChatDeliveryIndicator label="Read" status="read" />
      </>
    ),
    side: 'outgoing',
  },
  play: async ({ canvas, canvasElement }) => {
    const message = canvasElement.querySelector('[data-slot="chat-message"]')
    await expect(message).toHaveAttribute('data-align', 'end')
    await expect(canvas.queryByText('Casey')).toBeNull()
    await expect(canvas.getByRole('img', { name: 'Read' })).toBeVisible()
  },
}

export const Grouped: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1">
      <ChatMessage {...args}>The draft is in the shared folder.</ChatMessage>
      <ChatMessage {...args} grouped>
        Second pass is on the pricing section.
      </ChatMessage>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [first, second] = canvasElement.querySelectorAll(
      '[data-slot="chat-message"]',
    )
    if (!(first instanceof HTMLElement && second instanceof HTMLElement))
      throw new Error('The grouped messages did not render.')
    await expect(within(first).getByText('Casey')).toBeVisible()
    await expect(within(second).queryByText('Casey')).toBeNull()
  },
}

export const WithMentions: Story = {
  args: {
    children: (
      <ChatMessageText
        mentions={['Jordan']}
        text="@Jordan can you take the pricing section? @someone is not a member."
      />
    ),
  },
  play: async ({ canvas }) => {
    const mention = canvas.getByText('@Jordan')
    await expect(mention).toHaveClass('font-medium')
    await expect(canvas.queryByText('@someone')).toBeNull()
  },
}

export const Deleted: Story = {
  args: {
    bubble: false,
    children: (
      <p className="m-0 text-muted-foreground text-sm italic">
        This message was deleted.
      </p>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="chat-message-bubble"]'),
    ).toBeNull()
  },
}
