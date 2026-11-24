'use client'

import { CheckIcon, CircleIcon } from '@phosphor-icons/react'
import { FieldDescription } from '@tc96/ui/field'
import { type ReactElement, useState } from 'react'
import { getPasswordSuggestions } from './password-suggestions'
import type { AuthNewPasswordLabels, AuthPasswordSuggestion } from './types'

const suggestionLabelKeys = {
  lowercase: 'suggestionLowercase',
  number: 'suggestionNumber',
  symbol: 'suggestionSymbol',
  uppercase: 'suggestionUppercase',
} as const satisfies Record<AuthPasswordSuggestion, keyof AuthNewPasswordLabels>

export interface AuthPasswordFeedbackProps {
  labels: AuthNewPasswordLabels
  password: string
  suggestions: readonly AuthPasswordSuggestion[]
}

interface FeedbackState {
  announcement: string
  met: readonly AuthPasswordSuggestion[]
}

export function AuthPasswordFeedback({
  labels,
  password,
  suggestions,
}: Readonly<AuthPasswordFeedbackProps>): ReactElement {
  const met = getPasswordSuggestions(password, suggestions)
  const [state, setState] = useState<FeedbackState>({
    announcement: '',
    met,
  })
  if (state.met.join() !== met.join()) {
    const messages: string[] = []
    for (const suggestion of suggestions) {
      const wasMet = state.met.includes(suggestion)
      const isMet = met.includes(suggestion)
      if (wasMet !== isMet)
        messages.push(
          `${labels[suggestionLabelKeys[suggestion]]}: ${isMet ? labels.suggestionMet : labels.suggestionMissing}`,
        )
    }
    setState({ announcement: messages.join('. '), met })
  }
  return (
    <>
      <FieldDescription className="flex flex-col gap-1.5" render={<div />}>
        {suggestions.length ? (
          <ul className="flex gap-x-3 whitespace-nowrap text-xs">
            {suggestions.map((suggestion) => {
              const isMet = met.includes(suggestion)
              return (
                <li
                  className="flex items-center gap-1 transition-colors data-met:font-medium data-met:text-success-foreground"
                  data-met={isMet ? '' : undefined}
                  key={suggestion}
                >
                  {isMet ? (
                    <CheckIcon aria-hidden className="size-3" />
                  ) : (
                    <CircleIcon aria-hidden className="size-3" />
                  )}
                  {labels[suggestionLabelKeys[suggestion]]}
                  <span className="sr-only">
                    {` ${isMet ? labels.suggestionMet : labels.suggestionMissing}`}
                  </span>
                </li>
              )
            })}
          </ul>
        ) : null}
      </FieldDescription>
      <div aria-live="polite" className="sr-only">
        {state.announcement}
      </div>
    </>
  )
}
