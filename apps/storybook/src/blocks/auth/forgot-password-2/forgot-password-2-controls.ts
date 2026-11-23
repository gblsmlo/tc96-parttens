import type { ArgTypes } from '@storybook/react-vite'

export interface ForgotPassword2Controls {
  description: string
  destination: string
  emailError: string
  error: string
  pending: boolean
  sent: boolean
  sentTitle: string
  submit: string
  title: string
}

export const forgotPassword2ControlArgs: ForgotPassword2Controls = {
  description:
    'Informe seu e-mail e enviaremos um link para redefinir a senha.',
  destination: 'ana@acme.com',
  emailError: '',
  error: '',
  pending: false,
  sent: false,
  sentTitle: 'Verifique seu e-mail',
  submit: 'Enviar link',
  title: 'Esqueceu a senha?',
}

export const forgotPassword2ControlArgTypes: Partial<
  ArgTypes<ForgotPassword2Controls>
> = {
  description: {
    control: 'text',
    description:
      'Text of `labels.description`; empty removes the description of the form.',
  },
  destination: {
    control: 'text',
    description:
      'The `destination` named in the confirmation; empty makes the text generic. It acts only when `sent` is on.',
  },
  emailError: {
    control: 'text',
    description:
      'The `fieldErrors.email` message; empty leaves the field valid.',
  },
  error: {
    control: 'text',
    description:
      'The `error` message of the whole page; empty removes the `Alert`. It shows in the form and in the confirmation.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` state: disables the submit button.',
  },
  sent: {
    control: 'boolean',
    description:
      'The `sent` state: replaces the form by the confirmation inside the same card.',
  },
  sentTitle: {
    control: 'text',
    description:
      'Text of `labels.sentTitle`, the `h1` of the confirmation; keep it filled. It acts only when `sent` is on.',
  },
  submit: {
    control: 'text',
    description: 'Text of `labels.submit`, the submit button of the form.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the `h1` of the form; keep it filled. The confirmation has its own title.',
  },
}
