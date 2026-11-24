import type { ArgTypes } from '@storybook/react-vite'

export interface Login3Controls {
  aside: boolean
  emailError: string
  error: string
  passwordError: string
  pending: boolean
}

export const login3ControlArgs: Login3Controls = {
  aside: true,
  emailError: '',
  error: '',
  passwordError: '',
  pending: false,
}

export const login3ControlArgTypes: Partial<ArgTypes<Login3Controls>> = {
  aside: {
    control: 'boolean',
    description: 'The `aside` slot; off renders the single centered card.',
  },
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
    description: 'The `pending` prop of `Login3`.',
  },
}
