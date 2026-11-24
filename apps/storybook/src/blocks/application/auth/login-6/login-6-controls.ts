import type { ArgTypes } from '@storybook/react-vite'

export interface Login6Controls {
  emailError: string
  error: string
  media: boolean
  passwordError: string
  pending: boolean
}

export const login6ControlArgs: Login6Controls = {
  emailError: '',
  error: '',
  media: true,
  passwordError: '',
  pending: false,
}

export const login6ControlArgTypes: Partial<ArgTypes<Login6Controls>> = {
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  media: {
    control: 'boolean',
    description: 'The `media` slot; off renders the form column alone.',
  },
  passwordError: {
    control: 'text',
    description: 'The `password` entry of `fieldErrors`; empty removes it.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Login6`.',
  },
}
