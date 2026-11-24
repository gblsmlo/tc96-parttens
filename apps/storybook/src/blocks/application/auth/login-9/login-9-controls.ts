import type { ArgTypes } from '@storybook/react-vite'

export interface Login9Controls {
  brands: boolean
  emailError: string
  error: string
  pending: boolean
  providers: boolean
  rating: number
}

export const login9ControlArgs: Login9Controls = {
  brands: true,
  emailError: '',
  error: '',
  pending: false,
  providers: true,
  rating: 5,
}

export const login9ControlArgTypes: Partial<ArgTypes<Login9Controls>> = {
  brands: {
    control: 'boolean',
    description:
      'Passes `brandsLabel` and `brands` at the bottom of the aside.',
  },
  emailError: {
    control: 'text',
    description: 'The `email` entry of `fieldErrors`; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Login9`.',
  },
  providers: {
    control: 'boolean',
    description: 'Passes `providers`, stacked full width below the form.',
  },
  rating: {
    control: { max: 5, min: 0, type: 'number' },
    description: 'The `rating` of the testimonial; 0 removes the stars.',
  },
}
