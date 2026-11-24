import type { ArgTypes } from '@storybook/react-vite'

export interface Timeline3Controls {
  empty: boolean
  error: boolean
  pending: boolean
  title: string
}

export const timeline3ControlArgs: Timeline3Controls = {
  empty: false,
  error: false,
  pending: false,
  title: 'Fluxo de aprovação',
}

export const timeline3ControlArgTypes: Partial<ArgTypes<Timeline3Controls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes `steps` empty, which renders the empty state.',
  },
  error: {
    control: 'boolean',
    description: 'The `error` prop; renders the error state with a retry.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop; renders the skeleton.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the track.',
  },
}
