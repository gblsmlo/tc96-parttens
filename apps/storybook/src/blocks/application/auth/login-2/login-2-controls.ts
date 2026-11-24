import type { ArgTypes } from '@storybook/react-vite'

export interface Login2Controls {
  emailError: string
  error: string
  passwordError: string
  pending: boolean
}

export const login2ControlArgs: Login2Controls = {
  emailError: '',
  error: '',
  passwordError: '',
  pending: false,
}

export const login2ControlArgTypes: Partial<ArgTypes<Login2Controls>> = {
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  passwordError: {
    control: 'text',
    description: 'The `password` entry of `fieldErrors`; empty removes it.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Login2`.',
  },
}
