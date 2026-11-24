import type { ArgTypes } from '@storybook/react-vite'

export interface Onboarding2Controls {
  completed: boolean
  error: string
  next: string
  pending: boolean
  skippable: boolean
  step: string
  successTitle: string
}

export const onboarding2ControlArgs: Onboarding2Controls = {
  completed: false,
  error: '',
  next: 'Continuar',
  pending: false,
  skippable: true,
  step: 'profile',
  successTitle: 'Tudo pronto',
}

export const onboarding2ControlArgTypes: Partial<
  ArgTypes<Onboarding2Controls>
> = {
  completed: {
    control: 'boolean',
    description: 'Passes `completed`; the success state replaces the steps.',
  },
  error: {
    control: 'text',
    description: 'Passes `error`; empty renders no alert.',
  },
  next: { control: 'text', description: 'Text of `labels.next`.' },
  pending: {
    control: 'boolean',
    description: 'Passes `pending`; the next action is disabled.',
  },
  skippable: {
    control: 'boolean',
    description: 'Passes `onSkip`; without it the skip action is gone.',
  },
  step: {
    control: 'select',
    description: 'First step shown; the story restarts when it changes.',
    options: ['profile', 'workspace', 'invite'],
  },
  successTitle: {
    control: 'text',
    description: 'Text of `labels.successTitle`.',
  },
}
