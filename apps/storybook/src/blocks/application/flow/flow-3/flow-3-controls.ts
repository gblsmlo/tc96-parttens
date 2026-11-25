import type { ArgTypes } from '@storybook/react-vite'

export interface Flow3Controls {
  approvals: boolean
  empty: boolean
  error: boolean
  pending: boolean
  replay: boolean
  title: string
  waiting: boolean
}

export const flow3ControlArgs: Flow3Controls = {
  approvals: true,
  empty: false,
  error: false,
  pending: false,
  replay: true,
  title: 'Execução do pipeline',
  waiting: true,
}

export const flow3ControlArgTypes: Partial<ArgTypes<Flow3Controls>> = {
  approvals: {
    control: 'boolean',
    description:
      'Passes `onApprove` and `onReject`; without them the Aprovar and Recusar buttons are not rendered.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes `steps` empty, which renders the empty state.',
  },
  error: {
    control: 'boolean',
    description: 'The `error` prop: renders the error surface.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop: renders the skeleton.',
  },
  replay: {
    control: 'boolean',
    description:
      'Passes `onReplay`; without it the Reexecutar button is not rendered.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the monitor.',
  },
  waiting: {
    control: 'boolean',
    description:
      'Keeps the step waiting for approval; off turns it into a pending step.',
  },
}
