import type { ArgTypes } from '@storybook/react-vite'
import type { AuthPasswordSuggestion } from '@tc96/blocks/application/auth/signup-2'

export type Signup2SuggestionsName = 'all' | 'numberAndSymbol' | 'none'

export const signup2SuggestionsNames: Signup2SuggestionsName[] = [
  'all',
  'numberAndSymbol',
  'none',
]

export const signup2Suggestions: Record<
  Signup2SuggestionsName,
  AuthPasswordSuggestion[]
> = {
  all: ['lowercase', 'uppercase', 'number', 'symbol'],
  none: [],
  numberAndSymbol: ['number', 'symbol'],
}

export interface Signup2Controls {
  emailError: string
  error: string
  nameError: string
  passwordError: string
  passwordMinLength: number
  pending: boolean
  suggestions: Signup2SuggestionsName
}

export const signup2ControlArgs: Signup2Controls = {
  emailError: '',
  error: '',
  nameError: '',
  passwordError: '',
  passwordMinLength: 8,
  pending: false,
  suggestions: 'all',
}

export const signup2ControlArgTypes: Partial<ArgTypes<Signup2Controls>> = {
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  nameError: {
    control: 'text',
    description: 'The `name` entry of `fieldErrors`; empty removes it.',
  },
  passwordError: {
    control: 'text',
    description: 'The `password` entry of `fieldErrors`; empty removes it.',
  },
  passwordMinLength: {
    control: { min: 1, type: 'number' },
    description: 'The `passwordMinLength` of `Signup2`.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Signup2`.',
  },
  suggestions: {
    control: 'select',
    description:
      'The `passwordSuggestions` list: the four character types, number and symbol, or none.',
    options: signup2SuggestionsNames,
  },
}
