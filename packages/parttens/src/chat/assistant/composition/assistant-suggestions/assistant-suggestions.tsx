'use client'

import { Button } from '@tc96/ui/button'
import { cn } from '@tc96/utils'
import { MessageCircleQuestionIcon } from 'lucide-react'
import { type ReactElement, useId } from 'react'
import {
  assistantSuggestionClassName,
  assistantSuggestionsClassName,
} from '../../lib/variants'
import { useAssistantLabels } from '../../store/assistant-context'
import type { AssistantSuggestionsProps } from '../../types'

export function AssistantSuggestions({
  className,
  onSuggestion,
  suggestions,
}: Readonly<AssistantSuggestionsProps>): ReactElement | null {
  const labels = useAssistantLabels()
  const titleId = `assistant-suggestions-${useId()}`

  if (suggestions.length === 0) return null

  return (
    <section
      aria-labelledby={titleId}
      className={cn(assistantSuggestionsClassName, className)}
      data-slot="assistant-suggestions"
    >
      <h3 className="font-medium text-muted-foreground text-xs" id={titleId}>
        {labels.suggestions}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <Button
              className={assistantSuggestionClassName}
              data-slot="assistant-suggestion"
              onClick={() => onSuggestion?.(suggestion)}
              type="button"
              variant="outline"
            >
              <MessageCircleQuestionIcon aria-hidden="true" />
              {suggestion.label}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
