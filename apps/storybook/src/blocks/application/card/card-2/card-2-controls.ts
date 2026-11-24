import type { ArgTypes } from '@storybook/react-vite'

export interface Card2Controls {
  connectable: boolean
  title: string
}

export const card2ControlArgs: Card2Controls = {
  connectable: true,
  title: 'Integrações',
}

export const card2ControlArgTypes: Partial<ArgTypes<Card2Controls>> = {
  connectable: {
    control: 'boolean',
    description:
      'Whether `onConnect` is passed; without it no Connect button renders.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the list.',
  },
}
