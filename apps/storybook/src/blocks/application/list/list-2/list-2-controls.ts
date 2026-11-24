import type { ArgTypes } from '@storybook/react-vite'
import type { List2Range } from '@tc96/ui/blocks/application/list/list-2'

export interface List2Controls {
  currency: 'BRL' | 'USD'
  empty: boolean
  range: List2Range
  title: string
}

export const list2ControlArgs: List2Controls = {
  currency: 'BRL',
  empty: false,
  range: '30d',
  title: 'Ranking de vendedores',
}

export const list2ControlArgTypes: Partial<ArgTypes<List2Controls>> = {
  currency: {
    control: 'inline-radio',
    description: 'The `currency` prop of the amounts.',
    options: ['BRL', 'USD'],
  },
  empty: {
    control: 'boolean',
    description: 'Passes `entries` empty, which renders the empty state.',
  },
  range: {
    control: 'inline-radio',
    description:
      'Initial `range`; the story keeps it in state, as a consumer does.',
    options: ['7d', '30d', '12m'],
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the list.',
  },
}
