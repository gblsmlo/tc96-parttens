import { AssistantPanel, type AssistantSuggestion } from '@tc96/parttens'
import type { AssistantControls } from './assistant-controls.ts'
import { assistantMessageSets } from './assistant-variants.ts'
import { suggestions as sampleSuggestions } from './fixtures/assistant'

interface AssistantCallbacks {
  onAttach?: () => void
  onEnd?: () => void
  onExpandedChange?: (expanded: boolean) => void
  onHistory?: () => void
  onNewChat?: () => void
  onRetry?: (messageId: string) => void
  onSend?: (text: string) => void
  onSuggestion?: (suggestion: AssistantSuggestion) => void
}

const noop = () => {}

export const ComposedAssistant = ({
  attach,
  badge,
  description,
  disclaimer,
  end,
  expandToggle,
  expanded,
  greeting,
  history,
  messages,
  newChat,
  onAttach = noop,
  onEnd = noop,
  onExpandedChange = noop,
  onHistory = noop,
  onNewChat = noop,
  onRetry = noop,
  onSend = noop,
  onSuggestion = noop,
  placeholder,
  placement,
  retry,
  suggestions,
  title,
  typing,
}: Readonly<AssistantControls & AssistantCallbacks>) => (
  <AssistantPanel
    badge={badge}
    description={description || undefined}
    disclaimer={disclaimer}
    expanded={expanded}
    greeting={greeting || undefined}
    labels={title ? { title } : undefined}
    messages={assistantMessageSets[messages]}
    onAttach={attach ? onAttach : undefined}
    onEnd={end ? onEnd : undefined}
    onExpandedChange={expandToggle ? onExpandedChange : undefined}
    onHistory={history ? onHistory : undefined}
    onNewChat={newChat ? onNewChat : undefined}
    onRetry={retry ? onRetry : undefined}
    onSend={onSend}
    onSuggestion={onSuggestion}
    placeholder={placeholder}
    placement={placement}
    suggestions={suggestions ? sampleSuggestions : undefined}
    typing={typing}
  />
)
