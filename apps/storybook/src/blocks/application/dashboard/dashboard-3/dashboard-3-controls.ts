import type { ArgTypes } from '@storybook/react-vite'

export interface Dashboard3Controls {
  actions: boolean
  empty: boolean
  error: boolean
  pending: boolean
  tableTools: boolean
  title: string
}

export const dashboard3ControlArgs: Dashboard3Controls = {
  actions: true,
  empty: false,
  error: false,
  pending: false,
  tableTools: true,
  title: 'Cobertura das equipes',
}

export const dashboard3ControlArgTypes: Partial<ArgTypes<Dashboard3Controls>> =
  {
    actions: {
      control: 'boolean',
      description:
        'Passes `onAction`; without it the queue shows no action button.',
    },
    empty: {
      control: 'boolean',
      description: 'Passes `crew`, `queue` and `forecast` empty.',
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
        'Passes `onSearchChange` and `pagination` with `onPageChange`; off, the crew table shows every row with no search or pages.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the dashboard.',
    },
  }
