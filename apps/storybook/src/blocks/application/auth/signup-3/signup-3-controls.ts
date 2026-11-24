import type { ArgTypes } from '@storybook/react-vite'

export interface Signup3Controls {
  badge: string
  brands: boolean
  emailError: string
  error: string
  passwordError: string
  pending: boolean
  providers: boolean
}

export const signup3ControlArgs: Signup3Controls = {
  badge: 'Novo: relatórios com IA',
  brands: true,
  emailError: '',
  error: '',
  passwordError: '',
  pending: false,
  providers: true,
}

export const signup3ControlArgTypes: Partial<ArgTypes<Signup3Controls>> = {
  badge: {
    control: 'text',
    description: 'The `badge` text above the heading; empty removes it.',
  },
  brands: {
    control: 'boolean',
    description: 'The `brands` row and its `brandsLabel`.',
  },
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message inside the card; empty removes it.',
  },
  passwordError: {
    control: 'text',
    description: 'The `password` entry of `fieldErrors`; empty removes it.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Signup3`.',
  },
  providers: {
    control: 'boolean',
    description: 'The `providers` stacked above the form.',
  },
}
