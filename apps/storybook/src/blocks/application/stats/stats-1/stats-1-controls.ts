import type { ArgTypes } from '@storybook/react-vite'

export interface Stats1Controls {
  details: string
  empty: boolean
  export: string
  title: string
  withActions: boolean
}

export const stats1ControlArgs: Stats1Controls = {
  details: 'Ver detalhes',
  empty: false,
  export: 'Exportar',
  title: 'Indicadores',
  withActions: true,
}

export const stats1ControlArgTypes: Partial<ArgTypes<Stats1Controls>> = {
  details: {
    control: 'text',
    description: 'Text of `labels.details`, the first item of each card menu.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes an empty `stats` list, which shows the empty state.',
  },
  export: {
    control: 'text',
    description: 'Text of `labels.export`, the second item of each card menu.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the grid.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onStatAction`; off removes the overflow menu of every card.',
  },
}
