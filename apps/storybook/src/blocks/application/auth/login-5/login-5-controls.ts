import type { ArgTypes } from '@storybook/react-vite'

export interface Login5Controls {
  emailError: string
  error: string
  method: '' | 'email'
  passwordError: string
  pending: boolean
}

export const login5ControlArgs: Login5Controls = {
  emailError: '',
  error: '',
  method: '',
  passwordError: '',
  pending: false,
}

export const login5ControlArgTypes: Partial<ArgTypes<Login5Controls>> = {
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the content; empty removes it.',
  },
  method: {
    control: 'inline-radio',
    description: 'The `method` prop; `email` reveals the e-mail form.',
    options: ['', 'email'],
  },
  passwordError: {
    control: 'text',
    description: 'The `password` entry of `fieldErrors`; empty removes it.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Login5`.',
  },
}
