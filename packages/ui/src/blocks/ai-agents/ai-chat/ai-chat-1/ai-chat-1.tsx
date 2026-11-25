'use client'

import { Button } from '@tc96/ui/button'
import { ChatConversation } from '@tc96/ui/chat/chat-conversation'
import { ChatTypingIndicator } from '@tc96/ui/chat/chat-typing-indicator'
import { useChatScroll } from '@tc96/ui/chat/hooks/use-chat-scroll'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { cn } from '@tc96/utils'
import { type ReactElement, useId, useMemo } from 'react'
import { AiChat1Composer } from './ai-chat-1-composer'
import { AiChat1Header } from './ai-chat-1-header'
import { AiChat1Answer, AiChat1UserTurn } from './ai-chat-1-message'
import { AiChat1Skeleton } from './ai-chat-1-skeleton'
import { AiChat1StarterView } from './ai-chat-1-starter'
import { defaultAiChat1Labels } from './labels'
import type { AiChat1Props } from './types'

export function AiChat1({
  attachActions = [],
  chips = [],
  className,
  error = false,
  extendedThinking,
  labels: labelsOverride,
  listening,
  locale = 'pt-BR',
  messages,
  model,
  models = [],
  onAttach,
  onChipRemove,
  onCopy,
  onExport,
  onExtendedThinkingChange,
  onFeedback,
  onListeningChange,
  onModelChange,
  onNewThread,
  onRegenerate,
  onRetry,
  onSend,
  onStop,
  onThreadChange,
  onWebSearchChange,
  pending = false,
  responding = false,
  starters = [],
  threadId,
  threads = [],
  usage,
  webSearch,
}: Readonly<AiChat1Props>): ReactElement {
  const labels = { ...defaultAiChat1Labels, ...labelsOverride }
  const titleId = `ai-chat-1-title-${useId()}`
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { notation: 'compact' }),
    [locale],
  )
  const last = messages.at(-1)
  const streamingId =
    responding && last?.role === 'assistant' ? last.id : undefined
  const waiting = responding && last?.role !== 'assistant'
  const scroll = useChatScroll({
    itemCount: messages.length,
    layoutKey: `${last?.text.length ?? 0}-${responding}`,
  })
  const modelLabel = (id: string | undefined) =>
    models.find((item) => item.id === id)?.label ?? labels.assistant
  const send = (text: string) => {
    scroll.atBottomRef.current = true
    onSend(text)
  }
  const ready = !pending && !error

  return (
    <section
      aria-labelledby={titleId}
      className={cn('flex min-h-160 flex-1 flex-col bg-background', className)}
      data-slot="ai-chat-1"
    >
      <AiChat1Header
        formatCount={(value) => formatter.format(value)}
        labels={labels}
        onExport={ready && messages.length > 0 ? onExport : undefined}
        onNewThread={onNewThread}
        onThreadChange={onThreadChange}
        threadId={threadId}
        threads={threads}
        titleId={titleId}
        usage={ready ? usage : undefined}
      />
      {pending ? (
        <AiChat1Skeleton label={labels.loading} />
      ) : error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <StateSurface
            actions={
              onRetry ? (
                <Button onClick={onRetry} size="sm" variant="outline">
                  {labels.retry}
                </Button>
              ) : undefined
            }
            description={labels.errorDescription}
            kind="error"
            title={labels.errorTitle}
          />
        </div>
      ) : messages.length === 0 ? (
        <AiChat1StarterView
          disabled={responding}
          labels={labels}
          onPrompt={send}
          starters={starters}
        />
      ) : (
        <ChatConversation
          contentClassName="mx-auto w-full max-w-3xl"
          jumpLabel={labels.jump}
          label={labels.conversation}
          scroll={scroll}
        >
          <div className="flex flex-col gap-6 pt-6">
            {messages.map((message) =>
              message.role === 'user' ? (
                <AiChat1UserTurn
                  key={message.id}
                  labels={labels}
                  message={message}
                />
              ) : (
                <AiChat1Answer
                  author={modelLabel(message.model)}
                  key={message.id}
                  labels={labels}
                  message={message}
                  onCopy={onCopy}
                  onFeedback={onFeedback}
                  onRegenerate={onRegenerate}
                  streaming={message.id === streamingId}
                />
              ),
            )}
            <ChatTypingIndicator label={labels.thinking} visible={waiting} />
          </div>
        </ChatConversation>
      )}
      {error ? null : (
        <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pt-2 pb-4">
          <AiChat1Composer
            attachActions={attachActions}
            chips={chips}
            extendedThinking={extendedThinking}
            labels={labels}
            listening={listening}
            model={model}
            models={models}
            onAttach={onAttach}
            onChipRemove={onChipRemove}
            onExtendedThinkingChange={onExtendedThinkingChange}
            onListeningChange={onListeningChange}
            onModelChange={onModelChange}
            onSend={send}
            onStop={onStop}
            onWebSearchChange={onWebSearchChange}
            disabled={pending}
            responding={responding}
            webSearch={webSearch}
          />
        </div>
      )}
    </section>
  )
}
