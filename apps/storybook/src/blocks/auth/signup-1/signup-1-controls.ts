import type { ArgTypes } from '@storybook/react-vite'
import type { AuthPasswordSuggestion } from '@tc96/blocks/auth/signup-1'

export type SignupSuggestionsName = 'all' | 'numberAndSymbol' | 'none'

export const signupSuggestionsNames: SignupSuggestionsName[] = [
  'all',
  'numberAndSymbol',
  'none',
]

export const signupSuggestions: Record<
  SignupSuggestionsName,
  AuthPasswordSuggestion[]
> = {
  all: ['lowercase', 'uppercase', 'number', 'symbol'],
  none: [],
  numberAndSymbol: ['number', 'symbol'],
}

export interface SignupControls {
  emailError: string
  error: string
  login: boolean
  logo: boolean
  nameError: string
  passwordError: string
  passwordMinLength: number
  pending: boolean
  privacy: boolean
  providers: boolean
  suggestions: SignupSuggestionsName
  terms: boolean
}

export const signupControlArgs: SignupControls = {
  emailError: '',
  error: '',
  login: true,
  logo: true,
  nameError: '',
  passwordError: '',
  passwordMinLength: 8,
  pending: false,
  privacy: true,
  providers: true,
  suggestions: 'all',
  terms: true,
}

export const signupControlArgTypes: Partial<ArgTypes<SignupControls>> = {
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  login: {
    control: 'boolean',
    description: 'Passes `loginHref`, which renders the footer link.',
  },
  logo: {
    control: 'boolean',
    description: 'Passes a `logo` rendered inside the card, above the title.',
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
    description: 'The `passwordMinLength` of `Signup1`.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Signup1`.',
  },
  privacy: {
    control: 'boolean',
    description: 'Passes `privacyHref`, a link of the terms notice.',
  },
  providers: {
    control: 'boolean',
    description: 'Passes two `providers`, which render the buttons.',
  },
  suggestions: {
    control: 'select',
    description:
      'The `passwordSuggestions` list: the four character types, number and symbol, or none.',
    options: signupSuggestionsNames,
  },
  terms: {
    control: 'boolean',
    description: 'Passes `termsHref`, a link of the terms notice.',
  },
}
