import type { ReactNode } from 'react'

export type AiChat1ChipKind = 'file' | 'link' | 'page'

export interface AiChat1Chip {
  id: string
  kind?: AiChat1ChipKind
  label: string
}

export interface AiChat1Thread {
  id: string
  pinned?: boolean
  title: string
}

export interface AiChat1Model {
  description?: string
  id: string
  label: string
}

export interface AiChat1Starter {
  icon?: ReactNode
  id: string
  label: string
  prompts: readonly string[]
}

export interface AiChat1AttachAction {
  icon?: ReactNode
  id: string
  label: string
}

export interface AiChat1Source {
  href: string
  id: string
  title: string
}

export interface AiChat1Code {
  code: string
  language: string
}

export interface AiChat1Reasoning {
  seconds: number
  text: string
}

export type AiChat1Feedback = 'up' | 'down'

export interface AiChat1UserMessage {
  chips?: readonly AiChat1Chip[]
  id: string
  role: 'user'
  text: string
}

export interface AiChat1AssistantMessage {
  code?: AiChat1Code
  feedback?: AiChat1Feedback
  id: string
  model?: string
  reasoning?: AiChat1Reasoning
  role: 'assistant'
  sources?: readonly AiChat1Source[]
  text: string
}

export type AiChat1Message = AiChat1UserMessage | AiChat1AssistantMessage

export interface AiChat1Usage {
  limit: number
  used: number
}

export interface AiChat1Labels {
  assistant: string
  attach: string
  chips: string
  code: (language: string) => string
  contextWindow: string
  conversation: string
  copy: string
  copyCode: string
  disclaimer: string
  dislike: string
  errorDescription: string
  errorTitle: string
  extendedThinking: string
  jump: string
  like: string
  listening: string
  loading: string
  messageActions: (author: string) => string
  microphone: string
  model: string
  newThread: string
  pinned: string
  prompt: string
  promptPlaceholder: string
  reasoning: (seconds: number) => string
  recent: string
  regenerate: string
  removeChip: (label: string) => string
  retry: string
  send: string
  sources: string
  starterCategories: string
  starterDescription: string
  starterTitle: string
  stop: string
  thinking: string
  threadSwitcher: string
  title: string
  transcript: string
  usage: (used: string, limit: string) => string
  webSearch: string
}

export interface AiChat1Props {
  attachActions?: readonly AiChat1AttachAction[]
  chips?: readonly AiChat1Chip[]
  className?: string
  error?: boolean
  extendedThinking?: boolean
  labels?: Partial<AiChat1Labels>
  listening?: boolean
  locale?: string
  messages: readonly AiChat1Message[]
  model?: string
  models?: readonly AiChat1Model[]
  onAttach?: (actionId: string) => void
  onChipRemove?: (chipId: string) => void
  onCopy?: (text: string, messageId: string) => void
  onExtendedThinkingChange?: (enabled: boolean) => void
  onExport?: () => void
  onFeedback?: (messageId: string, feedback: AiChat1Feedback | null) => void
  onListeningChange?: (listening: boolean) => void
  onModelChange?: (modelId: string) => void
  onNewThread?: () => void
  onRegenerate?: (messageId: string) => void
  onRetry?: () => void
  onSend: (text: string) => void
  onStop?: () => void
  onThreadChange?: (threadId: string) => void
  onWebSearchChange?: (enabled: boolean) => void
  pending?: boolean
  responding?: boolean
  starters?: readonly AiChat1Starter[]
  threadId?: string
  threads?: readonly AiChat1Thread[]
  usage?: AiChat1Usage
  webSearch?: boolean
}
