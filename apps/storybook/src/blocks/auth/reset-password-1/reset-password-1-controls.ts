import type { ArgTypes } from '@storybook/react-vite'
import type { AuthPasswordSuggestion } from '@tc96/blocks/auth/reset-password-1'

export const passwordSuggestionNames: AuthPasswordSuggestion[] = [
  'lowercase',
  'uppercase',
  'number',
  'symbol',
]

export interface ResetPasswordControls {
  description: string
  error: string
  fieldError: string
  loginHref: boolean
  logo: boolean
  passwordMinLength: number
  passwordSuggestions: AuthPasswordSuggestion[]
  pending: boolean
  submit: string
  title: string
}

export const resetPasswordControlArgs: ResetPasswordControls = {
  description: 'Escolha uma nova senha para a sua conta.',
  error: '',
  fieldError: '',
  loginHref: true,
  logo: true,
  passwordMinLength: 8,
  passwordSuggestions: passwordSuggestionNames,
  pending: false,
  submit: 'Redefinir senha',
  title: 'Redefinir senha',
}

export const resetPasswordControlArgTypes: Partial<
  ArgTypes<ResetPasswordControls>
> = {
  description: {
    control: 'text',
    description: 'Text of `labels.description`; empty removes the description.',
  },
  error: {
    control: 'text',
    description:
      'The `error` message of the whole form; empty removes the `Alert`.',
  },
  fieldError: {
    control: 'text',
    description:
      'The `fieldErrors.password` message; empty leaves the field valid.',
  },
  loginHref: {
    control: 'boolean',
    description: 'Passes `loginHref`, which adds the link back to sign in.',
  },
  logo: {
    control: 'boolean',
    description:
      'Passes a `logo`, which renders inside the card, above the title.',
  },
  passwordMinLength: {
    control: { max: 32, min: 1, type: 'number' },
    description: 'The `passwordMinLength`: the native `minLength`.',
  },
  passwordSuggestions: {
    control: 'inline-check',
    description:
      'The `passwordSuggestions` listed under the new password; none checked hides the list.',
    options: passwordSuggestionNames,
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` state of the submit.',
  },
  submit: {
    control: 'text',
    description: 'Text of `labels.submit`, the submit button.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the `h1`; keep it filled, the page needs a title.',
  },
}
