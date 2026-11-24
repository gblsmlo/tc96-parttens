import type { ArgTypes } from '@storybook/react-vite'

export interface Card9Controls {
  title: string
  withActions: boolean
  withNotes: boolean
}

export const card9ControlArgs: Card9Controls = {
  title: 'Detalhes da entrega',
  withActions: true,
  withNotes: true,
}

export const card9ControlArgTypes: Partial<ArgTypes<Card9Controls>> = {
  title: { control: 'text', description: 'Text of `labels.title`.' },
  withActions: {
    control: 'boolean',
    description: 'Passes `actions` and `onActionSelect`, which show the menu.',
  },
  withNotes: {
    control: 'boolean',
    description: 'Passes `delivery.notes`, the notes section.',
  },
}
