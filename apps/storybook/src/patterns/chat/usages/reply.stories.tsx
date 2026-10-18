import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { ChatConversation } from '@tc96/ui/chat/chat-conversation'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { ChatMessageActionToolbar } from '@tc96/ui/chat/chat-message-actions'
import { ChatMessageText } from '@tc96/ui/chat/chat-message-text'
import {
  ChatReplyPreview,
  type ChatReplyTarget,
} from '@tc96/ui/chat/chat-reply-preview'
import { ChatReplyReference } from '@tc96/ui/chat/chat-reply-reference'
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
import { ArrowUpIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

interface Message {
  author: string
  id: number
  own: boolean
  replyTo?: number
  text: string
}

const initialMessages: Message[] = [
  {
    author: 'Casey',
    id: 0,
    own: false,
    text: 'Can you review the onboarding copy before Friday?',
  },
  {
    author: 'Casey',
    id: 1,
    own: false,
    text: 'The pricing section changed the most.',
  },
  { author: 'You', id: 2, own: true, text: 'On it this afternoon.' },
]

interface Reply {
  id: number
  target: ChatReplyTarget
}

function CaseyAvatar() {
  return (
    <Avatar aria-hidden="true" className="size-7 text-xs">
      <AvatarFallback>C</AvatarFallback>
    </Avatar>
  )
}

interface ReplyArgs {
  onSend: (text: string, replyTo: number | undefined) => void
}

const meta = {
  args: {
    onSend: fn((_text: string, _replyTo: number | undefined) => {}),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Focused reply, as in the COSS Chat docs. Reply on a message measures its bubble into a `ChatReplyTarget` and lifts it into `ChatReplyPreview` in the conversation `overlay`: the timeline goes `inactive`, the scroll controller pauses and the source stays mounted with `lifted`. Sending sets `dismissalRef` to `send` and adds the reply with a `ChatReplyReference`; cancel returns the bubble to its place. Clicking the reference scrolls to the source and highlights it.',
      },
    },
  },
  render: function ReplyUsage({ onSend }) {
    const [messages, setMessages] = useState(initialMessages)
    const [draft, setDraft] = useState<ComposerValue>([])
    const [reply, setReply] = useState<Reply | null>(null)
    const [highlighted, setHighlighted] = useState<number | null>(null)
    const bubbles = useRef(new Map<number, HTMLDivElement>())
    const dismissalRef = useRef<'cancel' | 'send'>('cancel')
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const scroll = useChatScroll({
      itemCount: messages.length,
      paused: reply !== null,
    })
    const replying = messages.find((message) => message.id === reply?.id)

    const startReply = (message: Message, firstInGroup: boolean) => {
      const source = bubbles.current.get(message.id)
      if (!source) return
      dismissalRef.current = 'cancel'
      setReply({
        id: message.id,
        target: { firstInGroup, source, width: source.offsetWidth },
      })
      inputRef.current?.focus()
    }
    const cancelReply = () => {
      dismissalRef.current = 'cancel'
      setReply(null)
    }
    const showSource = (id: number) => {
      bubbles.current.get(id)?.scrollIntoView({ block: 'center' })
      setHighlighted(id)
    }

    return (
      <section
        aria-label="Reply example"
        className="flex h-[28rem] w-full max-w-md flex-col rounded-xl border bg-popover"
      >
        <ChatConversation
          inactive={reply !== null}
          jumpLabel="Jump to latest"
          label="Team conversation"
          overlay={
            <AnimatePresence>
              {reply && replying && (
                <ChatReplyPreview
                  author={replying.author}
                  avatar={replying.own ? undefined : <CaseyAvatar />}
                  cancelLabel="Cancel reply"
                  dismissalRef={dismissalRef}
                  key={reply.id}
                  onCancel={cancelReply}
                  replyLabel={`Replying to ${replying.author}`}
                  side={replying.own ? 'outgoing' : 'incoming'}
                  target={reply.target}
                >
                  <ChatMessageText text={replying.text} />
                </ChatReplyPreview>
              )}
            </AnimatePresence>
          }
          scroll={scroll}
        >
          <div className="space-y-1 pt-4">
            {messages.map((message, index) => {
              const previous = messages[index - 1]
              const grouped =
                previous !== undefined && previous.author === message.author
              const quoted = messages.find(
                (candidate) => candidate.id === message.replyTo,
              )
              return (
                <ChatMessage
                  actions={
                    <ChatMessageActionToolbar
                      onReply={() => startReply(message, !grouped)}
                      replyLabel={`Reply to ${message.author}`}
                      replyTooltip="Reply"
                      side={message.own ? 'outgoing' : 'incoming'}
                      toolbarLabel="Message actions"
                    />
                  }
                  author={message.author}
                  avatar={<CaseyAvatar />}
                  bubbleProps={{
                    ref: (node: HTMLDivElement | null) => {
                      if (node) bubbles.current.set(message.id, node)
                      else bubbles.current.delete(message.id)
                    },
                  }}
                  className={grouped ? undefined : 'pt-3'}
                  grouped={grouped}
                  highlighted={highlighted === message.id}
                  key={message.id}
                  lifted={reply?.id === message.id}
                  onAnimationComplete={() => setHighlighted(null)}
                  side={message.own ? 'outgoing' : 'incoming'}
                >
                  {quoted && (
                    <ChatReplyReference
                      author={quoted.author}
                      onClick={() => showSource(quoted.id)}
                      preview={quoted.text}
                    />
                  )}
                  <ChatMessageText text={message.text} />
                </ChatMessage>
              )
            })}
          </div>
        </ChatConversation>
        <div className="shrink-0 px-4 pb-4">
          <Composer
            onSubmit={(value: ComposerValue) => {
              const text = getComposerText(value).trim()
              if (!text) return
              const replyTo = reply?.id
              dismissalRef.current = 'send'
              scroll.atBottomRef.current = true
              setReply(null)
              setMessages((current) => [
                ...current,
                { author: 'You', id: current.length, own: true, replyTo, text },
              ])
              setDraft([])
              onSend(text, replyTo)
            }}
            onValueChange={setDraft}
            submitOnEnter="desktop"
            value={draft}
          >
            <ComposerInput
              aria-label="Message"
              placeholder="Write a message…"
              render={<textarea ref={inputRef} />}
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
        </div>
      </section>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Usages/Reply',
} satisfies Meta<ReplyArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SendReply: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Reply lifts the first message above the composer and makes the timeline inert. Sending adds the reply with a reference to the source, and the reference brings the source back into view.',
      },
    },
  },
  play: async ({ args, canvas }) => {
    const log = canvas.getByRole('log', { name: 'Team conversation' })
    const [firstReply] = within(log).getAllByRole('button', {
      name: 'Reply to Casey',
    })
    if (!firstReply) throw new Error('The reply action did not render.')
    await userEvent.click(firstReply)

    await expect(await canvas.findByText('Replying to Casey')).toBeVisible()
    await waitFor(() => expect(log.closest('[inert]')).not.toBeNull())

    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'Notes are in the doc.')
    await userEvent.keyboard('{Enter}')
    await expect(args.onSend).toHaveBeenCalledWith('Notes are in the doc.', 0)

    await waitFor(() => expect(log.closest('[inert]')).toBeNull())
    const reference = await within(log).findByRole('button', {
      name: /Casey.*onboarding copy/,
    })
    await userEvent.click(reference)
  },
}

export const CancelReply: Story = {
  play: async ({ args, canvas }) => {
    const log = canvas.getByRole('log', { name: 'Team conversation' })
    const [firstReply] = within(log).getAllByRole('button', {
      name: 'Reply to Casey',
    })
    if (!firstReply) throw new Error('The reply action did not render.')
    await userEvent.click(firstReply)
    const [, cancel] = await canvas.findAllByRole('button', {
      name: 'Cancel reply',
    })
    if (!cancel) throw new Error('The cancel button did not render.')
    await userEvent.click(cancel)
    await waitFor(() =>
      expect(
        canvas.queryAllByRole('button', { name: 'Cancel reply' }),
      ).toHaveLength(0),
    )
    await expect(args.onSend).not.toHaveBeenCalled()
  },
}
