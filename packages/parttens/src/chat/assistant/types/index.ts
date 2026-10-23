import type { ReactNode } from 'react'
import type {
  AssistantLabels,
  AssistantMessage,
  AssistantPlacement,
  AssistantSuggestion,
} from '../core'

export interface AssistantPanelProps {
  badge?: boolean
  className?: string
  description?: ReactNode
  disclaimer?: ReactNode
  expanded?: boolean
  greeting?: ReactNode
  labels?: Partial<AssistantLabels>
  messages: readonly AssistantMessage[]
  onAttach?: () => void
  onEnd?: () => void
  onExpandedChange?: (expanded: boolean) => void
  onHistory?: () => void
  onNewChat?: () => void
  onRetry?: (messageId: string) => void
  onSend: (text: string) => void
  onSuggestion?: (suggestion: AssistantSuggestion) => void
  placeholder?: string
  placement?: AssistantPlacement
  suggestions?: readonly AssistantSuggestion[]
  typing?: boolean
}

export interface AssistantSuggestionsProps {
  className?: string
  onSuggestion?: (suggestion: AssistantSuggestion) => void
  suggestions: readonly AssistantSuggestion[]
}

export interface AssistantComposerProps {
  className?: string
  onAttach?: () => void
  onSend: (text: string) => void
  placeholder?: string
}
