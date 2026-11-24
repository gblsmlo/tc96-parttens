import type { ArgTypes } from '@storybook/react-vite'

export interface Timeline1Controls {
  attachments: boolean
  empty: boolean
  error: boolean
  pending: boolean
  title: string
}

export const timeline1ControlArgs: Timeline1Controls = {
  attachments: true,
  empty: false,
  error: false,
  pending: false,
  title: 'Atividades',
}

export const timeline1ControlArgTypes: Partial<ArgTypes<Timeline1Controls>> = {
  attachments: {
    control: 'boolean',
    description: 'Keeps or drops the `attachments` of every event.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes `events` empty, which renders the empty state.',
  },
  error: {
    control: 'boolean',
    description: 'The `error` prop: renders the error surface.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop: renders the skeleton.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the timeline.',
  },
}
