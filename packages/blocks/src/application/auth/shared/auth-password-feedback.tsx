'use client'

import { FieldDescription } from '@tc96/ui/field'
import { CheckIcon, CircleIcon } from 'lucide-react'
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
  minLength: number
  password: string
  suggestions: readonly AuthPasswordSuggestion[]
}

interface FeedbackState {
  announcement: string
  met: readonly AuthPasswordSuggestion[]
  minReached: boolean
}

export function AuthPasswordFeedback({
  labels,
  minLength,
  password,
  suggestions,
}: Readonly<AuthPasswordFeedbackProps>): ReactElement {
  const met = getPasswordSuggestions(password, suggestions)
  const minReached = password.length >= minLength
  const [state, setState] = useState<FeedbackState>({
    announcement: '',
    met,
    minReached,
  })
  if (state.minReached !== minReached || state.met.join() !== met.join()) {
    const messages: string[] = []
    if (state.minReached !== minReached)
      messages.push(labels.passwordLength(password.length, minLength))
    for (const suggestion of suggestions) {
      const wasMet = state.met.includes(suggestion)
      const isMet = met.includes(suggestion)
      if (wasMet !== isMet)
        messages.push(
          `${labels[suggestionLabelKeys[suggestion]]}: ${isMet ? labels.suggestionMet : labels.suggestionMissing}`,
        )
    }
    setState({ announcement: messages.join('. '), met, minReached })
  }
  return (
    <>
      <FieldDescription className="flex flex-col gap-1.5" render={<div />}>
        <span>{labels.passwordLength(password.length, minLength)}</span>
        {suggestions.length ? (
          <>
            <span>{labels.passwordSuggestionsTitle}</span>
            <ul className="flex flex-col gap-1">
              {suggestions.map((suggestion) => {
                const isMet = met.includes(suggestion)
                return (
                  <li
                    className="flex items-center gap-1.5"
                    data-met={isMet ? '' : undefined}
                    key={suggestion}
                  >
                    {isMet ? (
                      <CheckIcon aria-hidden className="size-3.5" />
                    ) : (
                      <CircleIcon aria-hidden className="size-3.5" />
                    )}
                    <span>{labels[suggestionLabelKeys[suggestion]]}</span>
                    <span>{`(${isMet ? labels.suggestionMet : labels.suggestionMissing})`}</span>
                  </li>
                )
              })}
            </ul>
          </>
        ) : null}
      </FieldDescription>
      <div aria-live="polite" className="sr-only">
        {state.announcement}
      </div>
    </>
  )
}
