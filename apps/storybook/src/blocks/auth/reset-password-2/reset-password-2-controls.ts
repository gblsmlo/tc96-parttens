import type { ArgTypes } from '@storybook/react-vite'
import type { AuthPasswordSuggestion } from '@tc96/blocks/auth/reset-password-2'

export const passwordSuggestionNames: AuthPasswordSuggestion[] = [
  'lowercase',
  'uppercase',
  'number',
  'symbol',
]

export interface ResetPassword2Controls {
  description: string
  error: string
  expiredDescription: string
  expiredTitle: string
  expiresIn: number
  fieldError: string
  loginHref: boolean
  logo: boolean
  passwordMinLength: number
  passwordSuggestions: AuthPasswordSuggestion[]
  pending: boolean
  requestNewLink: boolean
  requestNewLinkIn: number
  submit: string
  timer: boolean
  title: string
}

export const resetPassword2ControlArgs: ResetPassword2Controls = {
  description: 'Escolha uma nova senha para a sua conta.',
  error: '',
  expiredDescription:
    'Este link de redefinição expirou. Solicite um novo para continuar.',
  expiredTitle: 'Link expirado',
  expiresIn: 581,
  fieldError: '',
  loginHref: true,
  logo: true,
  passwordMinLength: 8,
  passwordSuggestions: passwordSuggestionNames,
  pending: false,
  requestNewLink: true,
  requestNewLinkIn: 0,
  submit: 'Redefinir senha',
  timer: true,
  title: 'Redefinir senha',
}

export const resetPassword2ControlArgTypes: Partial<
  ArgTypes<ResetPassword2Controls>
> = {
  description: {
    control: 'text',
    description:
      'Text of `labels.description`; empty removes the description of the form.',
  },
  error: {
    control: 'text',
    description:
      'The `error` message of the whole form; empty removes the `Alert`. It shows in the form and in the expired state.',
  },
  expiredDescription: {
    control: 'text',
    description:
      'Text of `labels.expiredDescription`, shown when the link has expired.',
  },
  expiredTitle: {
    control: 'text',
    description:
      'Text of `labels.expiredTitle`, the `h1` of the expired state; keep it filled.',
  },
  expiresIn: {
    control: { min: 0, type: 'number' },
    description:
      'The `expiresIn` seconds left on the link; 0 shows the expired state. It stops acting when `timer` is off.',
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
    description: 'Passes a `logo`, which renders inside the card, above the title.',
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
    description:
      'The `pending` state: disables the submit and the request button.',
  },
  requestNewLink: {
    control: 'boolean',
    description:
      'Passes `onRequestNewLink`, which adds the request button to the expired state.',
  },
  requestNewLinkIn: {
    control: { min: 0, type: 'number' },
    description:
      'The `requestNewLinkIn` seconds before another request; above 0 it disables the request button of the expired state.',
  },
  submit: {
    control: 'text',
    description: 'Text of `labels.submit`, the submit button.',
  },
  timer: {
    control: 'boolean',
    description:
      'Passes `expiresIn`; off, the page has no timer and no expired state, and the `expiresIn` control stops acting.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the `h1` of the form; keep it filled. The expired state has its own title.',
  },
}
