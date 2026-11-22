'use client'

import { AssistantPanel } from '@tc96/parttens/chat/assistant/composition/assistant-panel/assistant-panel'
import { mergeAssistantLabels } from '@tc96/parttens/chat/assistant/core'
import { useMediaQuery } from '@tc96/ui/hooks/use-media-query'
import { Sheet, SheetPopup } from '@tc96/ui/sheet'
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
    <Sheet
      onOpenChange={(next) => {
        if (!next) state.setAssistantOpen(false)
      }}
      open
    >
      <SheetPopup
        aria-label={mergeAssistantLabels(labels.assistant).title}
        className="h-full w-full max-w-none p-0"
        data-slot="flow-assistant-fullscreen"
        showCloseButton={false}
      >
        {panel}
      </SheetPopup>
    </Sheet>
  )
}
