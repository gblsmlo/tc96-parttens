import { Button } from '@tc96/ui/button'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { CircleAlertIcon, RotateCcwIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { AssistantMessage } from '../core'
import { useAssistantLabels } from '../store/assistant-context'

interface AssistantMessageItemProps {
  grouped: boolean
  message: AssistantMessage
  onRetry?: (messageId: string) => void
}

export function AssistantMessageItem({
  grouped,
  message,
  onRetry,
}: Readonly<AssistantMessageItemProps>): ReactElement {
  const labels = useAssistantLabels()
  const failed = message.role === 'assistant' && message.error === true

  return (
    <ChatMessage
      data-error={failed ? 'true' : undefined}
      footer={
        message.time ? <time dateTime={message.at}>{message.time}</time> : null
      }
      grouped={grouped}
      side={message.role === 'user' ? 'outgoing' : 'incoming'}
    >
      {failed ? (
        <div className="flex flex-col items-start gap-2">
          <p className="flex items-start gap-2 text-sm" role="alert">
            <CircleAlertIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-destructive-foreground"
            />
            {message.text}
          </p>
          {onRetry ? (
            <Button
              onClick={() => onRetry(message.id)}
              size="xs"
              type="button"
              variant="outline"
            >
              <RotateCcwIcon aria-hidden="true" />
              {labels.retry}
            </Button>
          ) : null}
        </div>
      ) : (
        message.text
      )}
    </ChatMessage>
  )
}
