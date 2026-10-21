import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { ChatConversation } from '@tc96/ui/chat/chat-conversation'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import {
  ChatEmptyState,
  ChatLoadingState,
  ChatStatusBar,
} from '@tc96/ui/chat/chat-states'
import { useChatScroll } from '@tc96/ui/chat/hooks/use-chat-scroll'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
  getComposerText,
} from '@tc96/ui/composer'
import { useMediaQuery } from '@tc96/ui/hooks/use-media-query'
import { ArrowUpIcon, MessagesSquareIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

interface ConversationMessage {
  id: number
  own: boolean
  text: string
}

interface ConversationArgs {
  connection: 'online' | 'loading' | 'offline'
  messages: ConversationMessage[]
  onReconnect: () => void
  onSend: (text: string) => void
}

const meta = {
  args: {
    connection: 'online',
    messages: [
      {
        id: 0,
        own: false,
        text: 'The same chat components can live directly in a page. Try sending a message.',
      },
    ],
    onReconnect: fn(),
    onSend: fn((_text: string) => {}),
  },
  argTypes: {
    connection: {
      control: 'inline-radio',
      options: ['online', 'loading', 'offline'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The minimal conversation of the COSS Chat docs, inline in a page: `ChatConversation` with its `useChatScroll` controller, `ChatMessage` rows and the COSS `Composer`. Enter sends on desktop and Shift + Enter adds a line; on touch input the hint is hidden. Sending sets `scroll.atBottomRef.current` first so the timeline follows the new message. `connection` and `messages` cover the states of the docs: loading shows skeletons, offline keeps the history above a status bar, and both disable the composer.',
      },
    },
  },
  render: function Conversation({
    connection,
    messages: initialMessages,
    onReconnect,
    onSend,
  }) {
    const [draft, setDraft] = useState<ComposerValue>([])
    const hintId = useId()
    const touchInput = useMediaQuery({ pointer: 'coarse' })
    const [messages, setMessages] = useState(initialMessages)
    const scroll = useChatScroll({ itemCount: messages.length })
    const online = connection === 'online'

    return (
      <section
        aria-label="Inline chat example"
        className="flex h-96 w-full max-w-md flex-col rounded-xl border bg-popover"
      >
        <ChatConversation
          jumpLabel="Jump to latest"
          label="Inline conversation"
          scroll={scroll}
        >
          {connection === 'loading' ? (
            <ChatLoadingState label="Loading messages" />
          ) : messages.length === 0 ? (
            <ChatEmptyState
              description="Send the first message to start the conversation."
              icon={<MessagesSquareIcon aria-hidden="true" />}
              title="No messages yet"
            />
          ) : (
            <div className="space-y-4 pt-4">
              {messages.map((message) => (
                <ChatMessage
                  animateEntrance={message.own}
                  author="Casey"
                  avatar={
                    <Avatar aria-hidden="true" className="size-7 text-xs">
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                  }
                  key={message.id}
                  side={message.own ? 'outgoing' : 'incoming'}
                >
                  {message.text}
                </ChatMessage>
              ))}
            </div>
          )}
        </ChatConversation>
        {connection === 'offline' && (
          <ChatStatusBar
            action={
              <Button onClick={onReconnect} size="sm" variant="outline">
                Reconnect
              </Button>
            }
            description="Messages you send will wait until the connection is back."
            title="Offline"
          />
        )}
        <div className="flex shrink-0 flex-col gap-2.5 px-4 pt-2 pb-4">
          <Composer
            disabled={!online}
            onSubmit={(value: ComposerValue) => {
              const text = getComposerText(value).trim()
              if (!text) return
              scroll.atBottomRef.current = true
              setMessages((current) => [
                ...current,
                { id: current.length, own: true, text },
              ])
              setDraft([])
              onSend(text)
            }}
            onValueChange={setDraft}
            submitOnEnter="desktop"
            value={draft}
          >
            <ComposerInput
              aria-describedby={touchInput ? undefined : hintId}
              aria-label="Inline message"
              placeholder="Write a message…"
              render={<textarea />}
            />
            <ComposerActions>
              <ComposerActionGroup align="end">
                <ComposerSubmit
                  render={
                    <Button aria-label="Send message" size="icon">
                      <ArrowUpIcon aria-hidden="true" />
                    </Button>
                  }
                />
              </ComposerActionGroup>
            </ComposerActions>
          </Composer>
          {!touchInput && (
            <p className="text-end text-muted-foreground text-xs" id={hintId}>
              Enter to send / Shift + Enter for a new line
            </p>
          )}
        </div>
      </section>
    )
  },
  tags: ['!autodocs'],
  title: 'UI/Chat/Usages/Conversation',
} satisfies Meta<ConversationArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SendMessage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Enter sends the draft as an outgoing message, the input clears, and a blank draft sends nothing.',
      },
    },
  },
  play: async ({ args, canvas }) => {
    const log = canvas.getByRole('log', { name: 'Inline conversation' })
    const input = canvas.getByRole('textbox', { name: 'Inline message' })

    await userEvent.click(input)
    await userEvent.keyboard('{Enter}')
    await expect(args.onSend).not.toHaveBeenCalled()

    await userEvent.type(input, 'Looks great, shipping it.')
    await userEvent.keyboard('{Enter}')
    await expect(args.onSend).toHaveBeenCalledWith('Looks great, shipping it.')
    const sent = await within(log).findByText('Looks great, shipping it.')
    await expect(sent.closest('[data-slot="chat-message"]')).toHaveAttribute(
      'data-align',
      'end',
    )
    await waitFor(() => expect(input).toHaveValue(''))
  },
}

export const Empty: Story = {
  args: { messages: [] },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByText('No messages yet')).toBeVisible()
    const input = canvas.getByRole('textbox', { name: 'Inline message' })
    await userEvent.type(input, 'Hello team{Enter}')
    await expect(args.onSend).toHaveBeenCalledWith('Hello team')
    await expect(canvas.queryByText('No messages yet')).toBeNull()
  },
}

export const Loading: Story = {
  args: { connection: 'loading' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading messages')).toBeInTheDocument()
    await expect(
      canvas.getByRole('textbox', { name: 'Inline message' }),
    ).toBeDisabled()
  },
}

export const Offline: Story = {
  args: { connection: 'offline' },
  play: async ({ args, canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Inline message' }),
    ).toBeDisabled()
    await expect(canvas.getByText(/Try sending a message/)).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Reconnect' }))
    await expect(args.onReconnect).toHaveBeenCalledTimes(1)
  },
}
