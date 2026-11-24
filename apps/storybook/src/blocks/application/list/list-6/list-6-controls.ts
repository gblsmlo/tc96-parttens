import type { ArgTypes } from '@storybook/react-vite'

export interface List6Controls {
  currency: string
  empty: boolean
  locale: string
  title: string
}

export const list6ControlArgs: List6Controls = {
  currency: 'BRL',
  empty: false,
  locale: 'pt-BR',
  title: 'Maiores variações',
}

export const list6ControlArgTypes: Partial<ArgTypes<List6Controls>> = {
  currency: {
    control: 'inline-radio',
    description: 'ISO currency of the price column.',
    options: ['BRL', 'USD'],
  },
  empty: {
    control: 'boolean',
    description: 'Passes no rows, which renders the empty state.',
  },
  locale: {
    control: 'inline-radio',
    description: 'Locale of the price and change columns.',
    options: ['pt-BR', 'en-US'],
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the table.',
  },
}
