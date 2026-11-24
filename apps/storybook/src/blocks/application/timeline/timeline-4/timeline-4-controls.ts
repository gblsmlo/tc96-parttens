import type { ArgTypes } from '@storybook/react-vite'

export interface Timeline4Controls {
  empty: boolean
  error: boolean
  open: boolean
  pending: boolean
  title: string
  trigger: string
}

export const timeline4ControlArgs: Timeline4Controls = {
  empty: false,
  error: false,
  open: false,
  pending: false,
  title: 'Atividades',
  trigger: 'Ver atividades',
}

export const timeline4ControlArgTypes: Partial<ArgTypes<Timeline4Controls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes `entries` empty, which renders the empty state.',
  },
  error: {
    control: 'boolean',
    description: 'The `error` prop; renders the error state with a retry.',
  },
  open: {
    control: 'boolean',
    description:
      'Initial `open`; the story keeps it in state, as a consumer does.',
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop; renders the skeleton inside the sheet.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the title of the sheet.',
  },
  trigger: {
    control: 'text',
    description: 'Text of `labels.trigger`, the label of the button.',
  },
}
