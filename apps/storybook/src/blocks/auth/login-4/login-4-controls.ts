import type { ArgTypes } from '@storybook/react-vite'

export interface Login4Controls {
  destination: string
  emailError: string
  error: string
  pending: boolean
  resend: boolean
  resendIn: number
  sent: boolean
}

export const login4ControlArgs: Login4Controls = {
  destination: 'ana@acme.com',
  emailError: '',
  error: '',
  pending: false,
  resend: true,
  resendIn: 0,
  sent: false,
}

export const login4ControlArgTypes: Partial<ArgTypes<Login4Controls>> = {
  destination: {
    control: 'text',
    description:
      'The `destination` shown in the confirmation; empty removes it.',
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
    description: 'The `pending` prop of `Login4`.',
  },
  resend: {
    control: 'boolean',
    description: 'Passes `onResend`, which renders the resend row.',
  },
  resendIn: {
    control: { min: 0, type: 'number' },
    description: 'Seconds left before the resend button works again.',
  },
  sent: {
    control: 'boolean',
    description: 'Replaces the form with the confirmation.',
  },
}
