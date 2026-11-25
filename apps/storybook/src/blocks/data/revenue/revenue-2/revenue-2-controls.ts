import type { ArgTypes } from '@storybook/react-vite'

export interface Revenue2Controls {
  bulkActions: boolean
  currency: string
  empty: boolean
  locale: string
  pageSize: number
  rowActions: boolean
  savedViews: boolean
  title: string
}

export const revenue2ControlArgs: Revenue2Controls = {
  bulkActions: true,
  currency: 'BRL',
  empty: false,
  locale: 'pt-BR',
  pageSize: 8,
  rowActions: true,
  savedViews: true,
  title: 'Revisão de renovações',
}

export const revenue2ControlArgTypes: Partial<ArgTypes<Revenue2Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onAssignOwner` and `onStageUpdate`; off, the ActionBar keeps only the count and Limpar seleção.',
  },
  currency: {
    control: 'inline-radio',
    description: 'ISO currency of the ARR, the upside and the summary.',
    options: ['BRL', 'USD'],
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no renewals, which renders the empty row of the table.',
  },
  locale: {
    control: 'inline-radio',
    description: 'Locale of the amounts, percentages and dates.',
    options: ['pt-BR', 'en-US'],
  },
  pageSize: {
    control: { max: 12, min: 3, step: 1, type: 'number' },
    description: 'Rows per page of the footer pagination.',
  },
  rowActions: {
    control: 'boolean',
    description:
      'Passes `rowActions` and `onRowAction`; off, the menu column is not rendered.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `views`, `activeViewId`, `onViewChange` and `onViewCreate`; off, the toolbar shows the heading and the renewal summary in its place.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the name of the section and of the table, and the toolbar heading when there are no views.',
  },
}
