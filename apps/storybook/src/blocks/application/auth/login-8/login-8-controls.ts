import type { ArgTypes } from '@storybook/react-vite'

export interface Login8Controls {
  emailError: string
  error: string
  media: boolean
  pending: boolean
  providers: boolean
}

export const login8ControlArgs: Login8Controls = {
  emailError: '',
  error: '',
  media: true,
  pending: false,
  providers: true,
}

export const login8ControlArgTypes: Partial<ArgTypes<Login8Controls>> = {
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
    description: 'Passes `media`, which renders the left panel from `md` up.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Login8`.',
  },
  providers: {
    control: 'boolean',
    description: 'Passes `providers`, stacked full width below the form.',
  },
}
