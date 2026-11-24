import type { ArgTypes } from '@storybook/react-vite'

export interface Table8Controls {
  bulkActions: boolean
  empty: boolean
  locale: string
  savedViews: boolean
  title: string
}

export const table8ControlArgs: Table8Controls = {
  bulkActions: true,
  empty: false,
  locale: 'pt-BR',
  savedViews: true,
  title: 'Transações',
}

export const table8ControlArgTypes: Partial<ArgTypes<Table8Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onExportSelected`, `onRefund` and `onFlag`; off, the ActionBar keeps only the count and Limpar seleção.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no transactions, which renders the empty row of the table.',
  },
  locale: {
    control: 'inline-radio',
    description: 'Locale of the amounts, the counts and the dates.',
    options: ['pt-BR', 'en-US'],
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `views`, `onViewChange` and `onViewCreate`; off, the view switcher is not rendered.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the toolbar heading and the name of the table.',
  },
}
