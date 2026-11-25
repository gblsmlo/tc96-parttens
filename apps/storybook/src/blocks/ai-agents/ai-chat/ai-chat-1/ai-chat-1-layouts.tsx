import {
  AiChat1,
  type AiChat1Chip,
  type AiChat1Feedback,
  type AiChat1Message,
} from '@tc96/ui/blocks/ai-agents/ai-chat/ai-chat-1'
import { useEffect, useRef, useState } from 'react'
import { fn } from 'storybook/test'
import {
  copilotAttachActions,
  copilotAttachChips,
  copilotChips,
  copilotMessages,
  copilotModels,
  copilotReply,
  copilotStarters,
  copilotThreads,
  copilotUsage,
} from '../fixtures/ai-chat-1.tsx'
import type { AiChat1Controls } from './ai-chat-1-controls.ts'

export const aiChat1Handlers = {
  onCopy: fn(),
  onExport: fn(),
  onFeedback: fn(),
  onNewThread: fn(),
  onRegenerate: fn(),
  onRetry: fn(),
  onSend: fn(),
  onStop: fn(),
}

const threadMessages = (threadId: string): AiChat1Message[] =>
  threadId === 'churn-query' ? copilotMessages : []

export interface CopilotRoomProps {
  conversation?: boolean
  replyDelay?: number
  withChips?: boolean
  withToggles?: boolean
  withUsage?: boolean
}

export const CopilotRoom = ({
  conversation = true,
  replyDelay = 0,
  withChips = true,
  withToggles = true,
  withUsage = true,
}: Readonly<CopilotRoomProps>) => {
  const [threadId, setThreadId] = useState(conversation ? 'churn-query' : 'new')
  const [messages, setMessages] = useState<AiChat1Message[]>(() =>
    threadMessages(threadId),
  )
  const [chips, setChips] = useState<AiChat1Chip[]>(
    withChips ? copilotChips : [],
  )
  const [model, setModel] = useState('atlas-pro')
  const [responding, setResponding] = useState(false)
  const [webSearch, setWebSearch] = useState(false)
  const [extendedThinking, setExtendedThinking] = useState(true)
  const [listening, setListening] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    [],
  )

  const stream = (id: string, text: string) => {
    const words = text.split(' ')
    const write = (count: number) =>
      setMessages((current) =>
        current.map((message) =>
          message.id === id
            ? { ...message, text: words.slice(0, count).join(' ') }
            : message,
        ),
      )
    if (replyDelay <= 0) {
      write(words.length)
      setResponding(false)
      return
    }
    let count = 0
    timer.current = setInterval(() => {
      count += 3
      write(count)
      if (count >= words.length) {
        stopTimer()
        setResponding(false)
      }
    }, replyDelay)
  }

  const answer = (prompt: string) => {
    const id = `a-${Date.now()}`
    setMessages((current) => [
      ...current,
      { id, model, role: 'assistant', text: '' },
    ])
    stream(id, copilotReply(prompt))
  }

  return (
    <AiChat1
      attachActions={copilotAttachActions}
      chips={chips}
      extendedThinking={extendedThinking}
      listening={listening}
      messages={messages}
      model={model}
      models={copilotModels}
      onAttach={(actionId) => {
        const chip = copilotAttachChips[actionId]
        if (chip && !chips.some((item) => item.id === chip.id))
          setChips((current) => [...current, chip])
      }}
      onChipRemove={(chipId) =>
        setChips((current) => current.filter((chip) => chip.id !== chipId))
      }
      onCopy={aiChat1Handlers.onCopy}
      onExport={aiChat1Handlers.onExport}
      onFeedback={(messageId, feedback: AiChat1Feedback | null) => {
        aiChat1Handlers.onFeedback(messageId, feedback)
        setMessages((current) =>
          current.map((message) =>
            message.id === messageId && message.role === 'assistant'
              ? { ...message, feedback: feedback ?? undefined }
              : message,
          ),
        )
      }}
      onModelChange={setModel}
      onNewThread={() => {
        aiChat1Handlers.onNewThread()
        stopTimer()
        setResponding(false)
        setThreadId('new')
        setMessages([])
      }}
      onRegenerate={(messageId) => {
        aiChat1Handlers.onRegenerate(messageId)
        const index = messages.findIndex((message) => message.id === messageId)
        const prompt = messages
          .slice(0, index)
          .reverse()
          .find((message) => message.role === 'user')
        setResponding(true)
        stream(messageId, copilotReply(prompt?.text ?? ''))
      }}
      onSend={(text) => {
        aiChat1Handlers.onSend(text)
        setMessages((current) => [
          ...current,
          {
            chips,
            id: `u-${Date.now()}`,
            role: 'user',
            text,
          },
        ])
        setChips([])
        setResponding(true)
        if (replyDelay <= 0) answer(text)
        else setTimeout(() => answer(text), replyDelay * 4)
      }}
      onStop={() => {
        aiChat1Handlers.onStop()
        stopTimer()
        setResponding(false)
      }}
      onThreadChange={(next) => {
        stopTimer()
        setResponding(false)
        setThreadId(next)
        setMessages(threadMessages(next))
      }}
      responding={responding}
      starters={copilotStarters}
      threadId={threadId}
      threads={copilotThreads}
      {...(withToggles
        ? {
            onExtendedThinkingChange: setExtendedThinking,
            onListeningChange: setListening,
            onWebSearchChange: setWebSearch,
          }
        : {})}
      {...(withUsage ? { usage: copilotUsage } : {})}
      webSearch={webSearch}
    />
  )
}

export const ComposedAiChat1 = ({
  conversation,
  replyDelay,
  state,
  withChips,
  withToggles,
  withUsage,
}: Readonly<AiChat1Controls>) => {
  if (state !== 'default')
    return (
      <div className="flex h-svh flex-col">
        <AiChat1
          error={state === 'error'}
          messages={[]}
          onRetry={aiChat1Handlers.onRetry}
          onSend={aiChat1Handlers.onSend}
          pending={state === 'pending'}
          threads={copilotThreads}
        />
      </div>
    )
  return (
    <div className="flex h-svh flex-col">
      <CopilotRoom
        conversation={conversation}
        key={`${conversation}-${withChips}`}
        replyDelay={replyDelay}
        withChips={withChips}
        withToggles={withToggles}
        withUsage={withUsage}
      />
    </div>
  )
}
