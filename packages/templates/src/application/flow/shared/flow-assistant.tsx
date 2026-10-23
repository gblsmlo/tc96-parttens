'use client'

import { AssistantPanel } from '@tc96/parttens/chat/assistant/composition/assistant-panel/assistant-panel'
import { useMediaQuery } from '@tc96/ui/hooks/use-media-query'
import type { ReactElement } from 'react'
import type { FlowAssistantConfig, FlowPageLabels } from './types'
import type { FlowPageState } from './use-flow-page-state'

export interface FlowAssistantProps {
  assistant: FlowAssistantConfig
  labels: FlowPageLabels
  state: FlowPageState
}

export function FlowAssistant({
  assistant,
  labels,
  state,
}: Readonly<FlowAssistantProps>): ReactElement | null {
  const wide = useMediaQuery('md')
  if (!state.assistantOpen) return null

  const panel = (
    <AssistantPanel
      description={assistant.description}
      expanded={state.assistantExpanded}
      greeting={assistant.greeting}
      labels={labels.assistant}
      messages={assistant.messages}
      onEnd={() => state.setAssistantOpen(false)}
      onExpandedChange={wide ? state.setAssistantExpanded : undefined}
      onNewChat={assistant.onNewChat}
      onRetry={assistant.onRetry}
      onSend={assistant.onSend}
      onSuggestion={assistant.onSuggestion}
      placeholder={labels.assistantPlaceholder}
      placement={wide ? 'floating' : 'docked'}
      suggestions={assistant.suggestions}
      typing={assistant.typing}
    />
  )

  if (wide) return panel
  return (
    <div
      className="fixed inset-0 z-50 bg-background"
      data-slot="flow-assistant-fullscreen"
    >
      {panel}
    </div>
  )
}
