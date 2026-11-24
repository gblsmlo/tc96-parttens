import type { ArgTypes } from '@storybook/react-vite'

export interface List1Controls {
  currency: 'BRL' | 'USD'
  empty: boolean
  showTrend: boolean
  title: string
}

export const list1ControlArgs: List1Controls = {
  currency: 'BRL',
  empty: false,
  showTrend: true,
  title: 'Métricas',
}

export const list1ControlArgTypes: Partial<ArgTypes<List1Controls>> = {
  currency: {
    control: 'inline-radio',
    description: 'The `currency` prop of the currency metrics.',
    options: ['BRL', 'USD'],
  },
  empty: {
    control: 'boolean',
    description: 'Passes `metrics` empty, which renders the empty state.',
  },
  showTrend: {
    control: 'boolean',
    description: 'Whether each metric carries `change`; without it no badge.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the list.',
  },
}
