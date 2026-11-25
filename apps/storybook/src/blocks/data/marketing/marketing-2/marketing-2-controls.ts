import type { ArgTypes } from '@storybook/react-vite'

export interface Marketing2Controls {
  currency: string
  empty: boolean
  headerActions: boolean
  locale: string
  pageSize: number
  rowActions: boolean
  title: string
}

export const marketing2ControlArgs: Marketing2Controls = {
  currency: 'BRL',
  empty: false,
  headerActions: true,
  locale: 'pt-BR',
  pageSize: 8,
  rowActions: true,
  title: 'Desempenho de campanhas',
}

export const marketing2ControlArgTypes: Partial<ArgTypes<Marketing2Controls>> =
  {
    currency: {
      control: 'inline-radio',
      description: 'ISO currency of the spend and CPA values.',
      options: ['BRL', 'USD'],
    },
    empty: {
      control: 'boolean',
      description:
        'Passes no campaigns, which renders the empty row of the table.',
    },
    headerActions: {
      control: 'boolean',
      description:
        'Passes `onExport` and `onCreate`; off, the toolbar buttons are not rendered.',
    },
    locale: {
      control: 'inline-radio',
      description: 'Locale of the numbers, percentages and dates.',
      options: ['pt-BR', 'en-US'],
    },
    pageSize: {
      control: { max: 12, min: 3, step: 1, type: 'number' },
      description:
        'Initial rows per page; it joins the `pageSizeOptions` of the footer selector.',
    },
    rowActions: {
      control: 'boolean',
      description:
        'Passes `rowActions` and `onRowAction`; off, the menu column is not rendered.',
    },
    title: {
      control: 'text',
      description:
        'Text of `labels.title`, the toolbar heading and the name of the table.',
    },
  }
