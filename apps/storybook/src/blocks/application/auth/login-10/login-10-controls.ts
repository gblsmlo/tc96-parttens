import type { ArgTypes } from '@storybook/react-vite'

export interface Login10Controls {
  emailError: string
  error: string
  footer: boolean
  passwordError: string
  pending: boolean
  providers: boolean
  rating: boolean
  testimonials: boolean
}

export const login10ControlArgs: Login10Controls = {
  emailError: '',
  error: '',
  footer: true,
  passwordError: '',
  pending: false,
  providers: true,
  rating: true,
  testimonials: true,
}

export const login10ControlArgTypes: Partial<ArgTypes<Login10Controls>> = {
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  footer: {
    control: 'boolean',
    description: 'The `footerLinks` and `copyright` props.',
  },
  passwordError: {
    control: 'text',
    description: 'The `password` entry of `fieldErrors`; empty removes it.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Login10`.',
  },
  providers: {
    control: 'boolean',
    description: 'The `providers` row below the form.',
  },
  rating: {
    control: 'boolean',
    description: 'The `rating` slot and the `proof` text.',
  },
  testimonials: {
    control: 'boolean',
    description: 'The `testimonials` carousel.',
  },
}
