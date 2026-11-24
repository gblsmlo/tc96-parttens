import type { ArgTypes } from '@storybook/react-vite'

export interface LoginControls {
  emailError: string
  error: string
  forgotPassword: boolean
  logo: boolean
  passwordError: string
  pending: boolean
  providers: boolean
  signup: boolean
}

export const loginControlArgs: LoginControls = {
  emailError: '',
  error: '',
  forgotPassword: true,
  logo: true,
  passwordError: '',
  pending: false,
  providers: true,
  signup: true,
}

export const loginControlArgTypes: Partial<ArgTypes<LoginControls>> = {
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  forgotPassword: {
    control: 'boolean',
    description: 'Passes `forgotPasswordHref`, which renders the link.',
  },
  logo: {
    control: 'boolean',
    description: 'Passes a `logo` rendered inside the card, above the title.',
  },
  passwordError: {
    control: 'text',
    description: 'The `password` entry of `fieldErrors`; empty removes it.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Login1`.',
  },
  providers: {
    control: 'boolean',
    description: 'Passes two `providers`, which render the buttons.',
  },
  signup: {
    control: 'boolean',
    description: 'Passes `signupHref`, which renders the footer link.',
  },
}
