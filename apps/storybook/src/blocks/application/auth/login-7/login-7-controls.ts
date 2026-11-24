import type { ArgTypes } from '@storybook/react-vite'

export interface Login7Controls {
  emailError: string
  error: string
  footerLinks: boolean
  passwordError: string
  pending: boolean
}

export const login7ControlArgs: Login7Controls = {
  emailError: '',
  error: '',
  footerLinks: true,
  passwordError: '',
  pending: false,
}

export const login7ControlArgTypes: Partial<ArgTypes<Login7Controls>> = {
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  footerLinks: {
    control: 'boolean',
    description: 'The `footerLinks` prop; off removes the page footer.',
  },
  passwordError: {
    control: 'text',
    description: 'The `password` entry of `fieldErrors`; empty removes it.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Login7`.',
  },
}
