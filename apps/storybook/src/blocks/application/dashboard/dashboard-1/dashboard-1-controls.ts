import type { ArgTypes } from '@storybook/react-vite'

export interface Dashboard1Controls {
  deltas: boolean
  empty: boolean
  error: boolean
  pending: boolean
  tableTools: boolean
  title: string
}

export const dashboard1ControlArgs: Dashboard1Controls = {
  deltas: true,
  empty: false,
  error: false,
  pending: false,
  tableTools: true,
  title: 'Exceções de expedição',
}

export const dashboard1ControlArgTypes: Partial<ArgTypes<Dashboard1Controls>> =
  {
    deltas: {
      control: 'boolean',
      description: 'Keeps or drops the `delta` of every KPI.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes `kpis`, `capacity`, `reasons` and `exceptions` empty.',
    },
    error: {
      control: 'boolean',
      description: 'The `error` prop: renders the error surface.',
    },
    pending: {
      control: 'boolean',
      description: 'The `pending` prop: renders the skeleton.',
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
