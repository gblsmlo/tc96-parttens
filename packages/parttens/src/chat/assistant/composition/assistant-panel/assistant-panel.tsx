'use client'

import { Badge } from '@tc96/ui/badge'
import { Card } from '@tc96/ui/card'
import { ChatConversation } from '@tc96/ui/chat/chat-conversation'
import { ChatTypingIndicator } from '@tc96/ui/chat/chat-typing-indicator'
import { useChatScroll } from '@tc96/ui/chat/hooks/use-chat-scroll'
import {
  HistoryIcon,
  Maximize2Icon,
  Minimize2Icon,
  SquarePenIcon,
  XIcon,
} from 'lucide-react'
import { type ReactElement, useId, useMemo } from 'react'
import { AssistantEmpty } from '../../components/assistant-empty'
import { AssistantHeaderAction } from '../../components/assistant-header-action'
import { AssistantMessageItem } from '../../components/assistant-message-item'
import {
  assistantDefaultDisclaimer,
  assistantItemCount,
  mergeAssistantLabels,
} from '../../core'
import {
  assistantActionsClassName,
  assistantCardClassName,
  assistantDisclaimerClassName,
  assistantFooterClassName,
  assistantHeaderClassName,
  assistantPanelClassName,
} from '../../lib/variants'
import { AssistantLabelsContext } from '../../store/assistant-context'
import type { AssistantPanelProps } from '../../types'
import { AssistantComposer } from '../assistant-composer/assistant-composer'

export function AssistantPanel({
  badge = true,
  className,
  description,
  disclaimer = assistantDefaultDisclaimer,
  expanded = false,
  greeting,
  labels: labelOverrides,
  messages,
  onAttach,
  onEnd,
  onExpandedChange,
  onHistory,
  onNewChat,
  onRetry,
  onSend,
  onSuggestion,
  placeholder,
  placement = 'docked',
  suggestions = [],
  typing = false,
}: Readonly<AssistantPanelProps>): ReactElement {
  const titleId = `assistant-title-${useId()}`
  const labels = useMemo(
    () => mergeAssistantLabels(labelOverrides),
    [labelOverrides],
  )
  const scroll = useChatScroll({
    itemCount: assistantItemCount(messages, typing),
  })
  const empty = messages.length === 0 && !typing

  return (
    <AssistantLabelsContext.Provider value={labels}>
      <section
        aria-labelledby={titleId}
        className={assistantPanelClassName(placement, expanded, className)}
        data-expanded={expanded}
        data-placement={placement}
        data-slot="assistant-panel"
      >
        <Card className={assistantCardClassName}>
          <div
            className={assistantHeaderClassName}
            data-slot="assistant-header"
          >
            <h2 className="font-semibold text-base" id={titleId}>
              {labels.title}
            </h2>
            {badge ? (
              <Badge size="sm" variant="outline">
                {labels.beta}
              </Badge>
            ) : null}
            <div
              className={assistantActionsClassName}
              data-slot="assistant-actions"
            >
              {onNewChat ? (
                <AssistantHeaderAction
                  label={labels.newChat}
                  onClick={onNewChat}
                >
                  <SquarePenIcon aria-hidden="true" />
                </AssistantHeaderAction>
              ) : null}
              {onHistory ? (
                <AssistantHeaderAction
                  label={labels.history}
                  onClick={onHistory}
                >
                  <HistoryIcon aria-hidden="true" />
                </AssistantHeaderAction>
              ) : null}
              {onExpandedChange ? (
                <AssistantHeaderAction
                  label={expanded ? labels.minimize : labels.expand}
                  onClick={() => onExpandedChange(!expanded)}
                >
                  {expanded ? (
                    <Minimize2Icon aria-hidden="true" />
                  ) : (
                    <Maximize2Icon aria-hidden="true" />
                  )}
                </AssistantHeaderAction>
              ) : null}
              {onEnd ? (
                <AssistantHeaderAction label={labels.end} onClick={onEnd}>
                  <XIcon aria-hidden="true" />
                </AssistantHeaderAction>
              ) : null}
            </div>
          </div>
          {empty ? (
            <AssistantEmpty
              description={description}
              greeting={greeting}
              onSuggestion={onSuggestion}
              suggestions={suggestions}
            />
          ) : (
            <ChatConversation
              jumpLabel={labels.jump}
              label={labels.conversation}
              scroll={scroll}
            >
              <div className="flex flex-col gap-3 pt-4">
                {messages.map((message, index) => (
                  <AssistantMessageItem
                    grouped={messages[index - 1]?.role === message.role}
                    key={message.id}
                    message={message}
                    onRetry={onRetry}
                  />
                ))}
                <ChatTypingIndicator label={labels.typing} visible={typing} />
              </div>
            </ChatConversation>
          )}
          <div
            className={assistantFooterClassName}
            data-slot="assistant-footer"
          >
            <AssistantComposer
              onAttach={onAttach}
              onSend={(text) => {
                scroll.atBottomRef.current = true
                onSend(text)
              }}
              placeholder={placeholder}
            />
            <p
              className={assistantDisclaimerClassName}
              data-slot="assistant-disclaimer"
            >
              {disclaimer}
            </p>
          </div>
        </Card>
      </section>
    </AssistantLabelsContext.Provider>
  )
}
