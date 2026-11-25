import {
  ArrowClockwiseIcon,
  CaretDownIcon,
  CopyIcon,
  FileTextIcon,
  GlobeIcon,
  LinkSimpleIcon,
  SparkleIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { ChatMessageText } from '@tc96/ui/chat/chat-message-text'
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { Toggle } from '@tc96/ui/toggle'
import type { ReactElement } from 'react'
import type {
  AiChat1AssistantMessage,
  AiChat1Chip,
  AiChat1ChipKind,
  AiChat1Feedback,
  AiChat1Labels,
  AiChat1UserMessage,
} from './types'

export const chipIcons = {
  file: FileTextIcon,
  link: LinkSimpleIcon,
  page: GlobeIcon,
} satisfies Record<AiChat1ChipKind, unknown>

function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function AiChat1ChipLabel({
  chip,
}: Readonly<{ chip: AiChat1Chip }>): ReactElement {
  const Icon = chipIcons[chip.kind ?? 'file']
  return (
    <>
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="truncate">{chip.label}</span>
    </>
  )
}

export function AiChat1UserTurn({
  labels,
  message,
}: Readonly<{
  labels: AiChat1Labels
  message: AiChat1UserMessage
}>): ReactElement {
  const chips = message.chips ?? []
  return (
    <ChatMessage data-slot="ai-chat-user-message" side="outgoing">
      <div className="flex min-w-0 flex-col gap-2">
        {chips.length > 0 ? (
          <ul aria-label={labels.chips} className="flex flex-wrap gap-1">
            {chips.map((chip) => (
              <li
                className="flex max-w-48 items-center gap-1 rounded-md bg-background/16 px-1.5 py-0.5 text-xs"
                key={chip.id}
              >
                <AiChat1ChipLabel chip={chip} />
              </li>
            ))}
          </ul>
        ) : null}
        <ChatMessageText text={message.text} />
      </div>
    </ChatMessage>
  )
}

export interface AiChat1AnswerProps {
  author: string
  labels: AiChat1Labels
  message: AiChat1AssistantMessage
  onCopy?: ((text: string, messageId: string) => void) | undefined
  onFeedback?:
    | ((messageId: string, feedback: AiChat1Feedback | null) => void)
    | undefined
  onRegenerate?: ((messageId: string) => void) | undefined
  streaming: boolean
}

export function AiChat1Answer({
  author,
  labels,
  message,
  onCopy,
  onFeedback,
  onRegenerate,
  streaming,
}: Readonly<AiChat1AnswerProps>): ReactElement {
  const sources = message.sources ?? []
  const showActions = !streaming && (onCopy || onRegenerate || onFeedback)
  const vote = (value: AiChat1Feedback, pressed: boolean) =>
    onFeedback?.(message.id, pressed ? value : null)

  return (
    <ChatMessage
      author={author}
      avatar={
        <Avatar className="size-7">
          <AvatarFallback>
            <SparkleIcon aria-hidden="true" className="size-4" />
          </AvatarFallback>
        </Avatar>
      }
      bubble={false}
      data-slot="ai-chat-answer"
      footer={
        showActions ? (
          <fieldset
            className="flex min-w-0 items-center gap-1"
            data-slot="ai-chat-answer-actions"
          >
            <legend className="sr-only">{labels.messageActions(author)}</legend>
            {onCopy ? (
              <Button
                aria-label={labels.copy}
                onClick={() => onCopy(message.text, message.id)}
                size="icon-sm"
                variant="ghost"
              >
                <CopyIcon aria-hidden="true" />
              </Button>
            ) : null}
            {onRegenerate ? (
              <Button
                aria-label={labels.regenerate}
                onClick={() => onRegenerate(message.id)}
                size="icon-sm"
                variant="ghost"
              >
                <ArrowClockwiseIcon aria-hidden="true" />
              </Button>
            ) : null}
            {onFeedback ? (
              <>
                <Toggle
                  aria-label={labels.like}
                  onPressedChange={(pressed) => vote('up', pressed)}
                  pressed={message.feedback === 'up'}
                  size="sm"
                >
                  <ThumbsUpIcon aria-hidden="true" />
                </Toggle>
                <Toggle
                  aria-label={labels.dislike}
                  onPressedChange={(pressed) => vote('down', pressed)}
                  pressed={message.feedback === 'down'}
                  size="sm"
                >
                  <ThumbsDownIcon aria-hidden="true" />
                </Toggle>
              </>
            ) : null}
          </fieldset>
        ) : undefined
      }
      side="incoming"
    >
      <div className="flex min-w-0 flex-col gap-3">
        {message.reasoning ? (
          <Collapsible data-slot="ai-chat-reasoning">
            <CollapsibleTrigger
              render={
                <Button
                  className="group/reasoning -ms-2 self-start"
                  size="sm"
                  variant="ghost"
                />
              }
            >
              {labels.reasoning(message.reasoning.seconds)}
              <CaretDownIcon
                aria-hidden="true"
                className="transition-transform group-data-panel-open/reasoning:rotate-180"
              />
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <p className="mt-1 whitespace-pre-wrap border-s-2 ps-3 text-muted-foreground text-sm">
                {message.reasoning.text}
              </p>
            </CollapsiblePanel>
          </Collapsible>
        ) : null}
        {paragraphs(message.text).map((part, index) => (
          <ChatMessageText key={`${message.id}-${index}`} text={part} />
        ))}
        {message.code ? (
          <figure
            className="overflow-hidden rounded-lg border bg-muted/40"
            data-slot="ai-chat-code"
          >
            <figcaption className="flex items-center justify-between gap-2 border-b py-1 ps-3 pe-1 text-muted-foreground text-xs">
              {labels.code(message.code.language)}
              {onCopy ? (
                <Button
                  aria-label={labels.copyCode}
                  onClick={() =>
                    message.code && onCopy(message.code.code, message.id)
                  }
                  size="icon-sm"
                  variant="ghost"
                >
                  <CopyIcon aria-hidden="true" />
                </Button>
              ) : null}
            </figcaption>
            <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
              <code>{message.code.code}</code>
            </pre>
          </figure>
        ) : null}
        {sources.length > 0 ? (
          <ol
            aria-label={labels.sources}
            className="flex flex-wrap gap-1.5"
            data-slot="ai-chat-sources"
          >
            {sources.map((source, index) => (
              <li key={source.id}>
                <a
                  className="flex max-w-56 items-center gap-1.5 rounded-md border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={source.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span
                    aria-hidden="true"
                    className="font-medium text-muted-foreground tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <span className="truncate">{source.title}</span>
                </a>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </ChatMessage>
  )
}
