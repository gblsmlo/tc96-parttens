import type { ArgTypes } from '@storybook/react-vite'

export interface Dashboard2Controls {
  empty: boolean
  error: boolean
  pending: boolean
  sparklines: boolean
  tableTools: boolean
  title: string
}

export const dashboard2ControlArgs: Dashboard2Controls = {
  empty: false,
  error: false,
  pending: false,
  sparklines: true,
  tableTools: true,
  title: 'Receita do varejo',
}

export const dashboard2ControlArgTypes: Partial<ArgTypes<Dashboard2Controls>> =
  {
    empty: {
      control: 'boolean',
      description: 'Passes `kpis`, `sales` and `orders` empty.',
    },
    error: {
      control: 'boolean',
      description: 'The `error` prop: renders the error surface.',
    },
    pending: {
      control: 'boolean',
      description: 'The `pending` prop: renders the skeleton.',
    },
    sparklines: {
      control: 'boolean',
      description: 'Keeps or drops the `sparkline` of every KPI.',
    },
    tableTools: {
      control: 'boolean',
      description:
        'Passes `onSearchChange`, `pagination` with `onPageChange` and `onRowAction`; off, the table shows every row with no search, pages or row menu.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the dashboard.',
    },
  }
