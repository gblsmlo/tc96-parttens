import { SparklesIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { AssistantSuggestions } from '../composition/assistant-suggestions/assistant-suggestions'
import type { AssistantSuggestion } from '../core'
import { assistantEmptyClassName } from '../lib/variants'

interface AssistantEmptyProps {
  description?: ReactNode
  greeting?: ReactNode
  onSuggestion?: (suggestion: AssistantSuggestion) => void
  suggestions: readonly AssistantSuggestion[]
}

export function AssistantEmpty({
  description,
  greeting,
  onSuggestion,
  suggestions,
}: Readonly<AssistantEmptyProps>): ReactElement {
  return (
    <div className={assistantEmptyClassName} data-slot="assistant-empty">
      <div className="flex flex-col gap-2">
        <SparklesIcon
          aria-hidden="true"
          className="size-6 text-muted-foreground"
        />
        {greeting ? (
          <p className="font-semibold text-lg" data-slot="assistant-greeting">
            {greeting}
          </p>
        ) : null}
        {description ? (
          <p
            className="text-muted-foreground text-sm"
            data-slot="assistant-description"
          >
            {description}
          </p>
        ) : null}
      </div>
      <AssistantSuggestions
        onSuggestion={onSuggestion}
        suggestions={suggestions}
      />
    </div>
  )
}
