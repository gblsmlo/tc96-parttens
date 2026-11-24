import type { ArgTypes } from '@storybook/react-vite'

export interface Stats7Controls {
  currency: 'BRL' | 'USD'
  empty: boolean
  error: boolean
  pending: boolean
  title: string
}

export const stats7ControlArgs: Stats7Controls = {
  currency: 'BRL',
  empty: false,
  error: false,
  pending: false,
  title: 'Métricas',
}

export const stats7ControlArgTypes: Partial<ArgTypes<Stats7Controls>> = {
  currency: {
    control: 'inline-radio',
    description: 'The `currency` prop of the currency metric.',
    options: ['BRL', 'USD'],
  },
  empty: {
    control: 'boolean',
    description: 'Passes `metrics` empty.',
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
    description: 'Text of `labels.title`, the name of the section.',
  },
}
