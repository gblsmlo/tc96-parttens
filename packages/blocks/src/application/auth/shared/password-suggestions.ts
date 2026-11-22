import type { AuthPasswordSuggestion } from './types'

const suggestionPatterns: Record<AuthPasswordSuggestion, RegExp> = {
  lowercase: /\p{Ll}/u,
  number: /\p{Nd}/u,
  symbol: /[^\p{L}\p{N}\s]/u,
  uppercase: /\p{Lu}/u,
}

export const defaultPasswordSuggestions: AuthPasswordSuggestion[] = [
  'lowercase',
  'uppercase',
  'number',
  'symbol',
]

export function getPasswordSuggestions(
  password: string,
  suggestions: readonly AuthPasswordSuggestion[],
): AuthPasswordSuggestion[] {
  return suggestions.filter((suggestion) =>
    suggestionPatterns[suggestion].test(password),
  )
}
