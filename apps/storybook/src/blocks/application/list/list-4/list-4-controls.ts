import type { ArgTypes } from '@storybook/react-vite'

export interface List4Controls {
  connectable: boolean
  empty: boolean
  title: string
}

export const list4ControlArgs: List4Controls = {
  connectable: true,
  empty: false,
  title: 'Integrações',
}

export const list4ControlArgTypes: Partial<ArgTypes<List4Controls>> = {
  connectable: {
    control: 'boolean',
    description:
      'Whether `onConnect` is passed; without it no Connect button renders.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no integrations, which renders the empty state.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the list.',
  },
}
