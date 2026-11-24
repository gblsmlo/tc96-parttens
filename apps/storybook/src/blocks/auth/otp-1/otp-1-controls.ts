import type { ArgTypes } from '@storybook/react-vite'

export interface OtpControls {
  codeError: string
  destination: string
  error: string
  logo: boolean
  pending: boolean
  resend: boolean
  resendIn: number
}

export const otpControlArgs: OtpControls = {
  codeError: '',
  destination: 'ana@acme.com',
  error: '',
  logo: true,
  pending: false,
  resend: true,
  resendIn: 0,
}

export const otpControlArgTypes: Partial<ArgTypes<OtpControls>> = {
  codeError: {
    control: 'text',
    description: 'The `code` entry of `fieldErrors`; empty removes it.',
  },
  destination: {
    control: 'text',
    description:
      'The `destination` named in the description; empty removes it.',
  },
  error: {
    control: 'text',
    description: 'The `error` message above the form; empty removes it.',
  },
  logo: {
    control: 'boolean',
    description: 'Passes a `logo` rendered inside the card, above the title.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop of `Otp1`.',
  },
  resend: {
    control: 'boolean',
    description: 'Passes `onResend`, which renders the resend footer.',
  },
  resendIn: {
    control: { min: 0, type: 'number' },
    description:
      'The `resendIn` seconds left; above zero the resend button is disabled.',
  },
}
