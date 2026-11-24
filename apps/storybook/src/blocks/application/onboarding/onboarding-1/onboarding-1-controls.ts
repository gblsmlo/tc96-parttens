import type { ArgTypes } from '@storybook/react-vite'

export interface Onboarding1Controls {
  completed: boolean
  error: string
  next: string
  pending: boolean
  skippable: boolean
  step: string
  successTitle: string
}

export const onboarding1ControlArgs: Onboarding1Controls = {
  completed: false,
  error: '',
  next: 'Continuar',
  pending: false,
  skippable: true,
  step: 'profile',
  successTitle: 'Tudo pronto',
}

export const onboarding1ControlArgTypes: Partial<
  ArgTypes<Onboarding1Controls>
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
