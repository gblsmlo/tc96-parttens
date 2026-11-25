import type { ArgTypes } from '@storybook/react-vite'

export interface Dashboard7Controls {
  cellDrillDown: boolean
  empty: boolean
  error: boolean
  filters: boolean
  pending: boolean
  title: string
}

export const dashboard7ControlArgs: Dashboard7Controls = {
  cellDrillDown: true,
  empty: false,
  error: false,
  filters: true,
  pending: false,
  title: 'Analítico financeiro',
}

export const dashboard7ControlArgTypes: Partial<ArgTypes<Dashboard7Controls>> =
  {
    cellDrillDown: {
      control: 'boolean',
      description:
        'Passes `onCellSelect`; without it the cash-flow grid shows plain values instead of buttons.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes every list empty and no balances, indicators or receivables.',
    },
    error: {
      control: 'boolean',
      description: 'The `error` prop: renders the error surface.',
    },
    filters: {
      control: 'boolean',
      description:
        'Passes `onAccountChange` and `onCategoryKindChange`; off, the account filter and the Receitas / Despesas toggle are hidden.',
    },
    pending: {
      control: 'boolean',
      description: 'The `pending` prop: renders the skeleton.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the dashboard.',
    },
  }
