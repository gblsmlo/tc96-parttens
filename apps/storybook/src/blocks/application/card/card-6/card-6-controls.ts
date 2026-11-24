import type { ArgTypes } from '@storybook/react-vite'

export interface Card6Controls {
  empty: boolean
  title: string
  withApply: boolean
  withSave: boolean
}

export const card6ControlArgs: Card6Controls = {
  empty: false,
  title: 'Vagas recomendadas',
  withApply: true,
  withSave: true,
}

export const card6ControlArgTypes: Partial<ArgTypes<Card6Controls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes an empty `jobs` list, which shows the empty state.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the list.',
  },
  withApply: {
    control: 'boolean',
    description: 'Passes `onApply`, which shows the apply button on each card.',
  },
  withSave: {
    control: 'boolean',
    description:
      'Passes `onSaveChange`, which shows the save toggle on each card.',
  },
}
