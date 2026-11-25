import type { ArgTypes } from '@storybook/react-vite'

export interface DataGrid8Controls {
  bulkActions: boolean
  empty: boolean
  locale: string
  savedViews: boolean
  title: string
}

export const dataGrid8ControlArgs: DataGrid8Controls = {
  bulkActions: true,
  empty: false,
  locale: 'pt-BR',
  savedViews: true,
  title: 'Transações',
}

export const dataGrid8ControlArgTypes: Partial<ArgTypes<DataGrid8Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onExportSelected`, `onRefund` and `onFlag`; off, the ActionBar keeps only the count and Limpar seleção.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no transactions, which renders the empty row of the grid.',
  },
  locale: {
    control: 'inline-radio',
    description: 'Locale of the amounts, the counts and the dates.',
    options: ['pt-BR', 'en-US'],
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `views`, `onViewChange` and `onViewCreate`; off, the toolbar shows the heading and the loaded count in its place.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the name of the section and of the grid, and the toolbar heading when there are no views.',
  },
}
